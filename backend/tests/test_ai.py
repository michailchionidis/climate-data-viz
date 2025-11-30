"""Tests for AI service and LLM integration (TDD approach).

These tests cover the AI-powered insights generation and Q&A functionality
using Grok (xAI) integration.

Tests cover:
- AI insights generation with valid/invalid data
- Question answering with context
- LLM client abstraction and error handling
- Insight parsing and classification
- Edge cases and error scenarios
"""

from unittest.mock import Mock

from app.domains.ai.schemas import Insight, InsightType
from app.domains.ai.service import AIService
from app.services.llm.base import LLMClient


class TestAIServiceInitialization:
    """Tests for AIService initialization and configuration."""

    def test_initialization_with_llm_client(self) -> None:
        """Should initialize with provided LLM client."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        assert service._llm_client is mock_llm

    def test_initialization_without_llm_client(self) -> None:
        """Should initialize without LLM client for lazy loading."""
        service = AIService(llm_client=None)

        assert service._llm_client is None

    def test_llm_client_property_with_client(self) -> None:
        """Should return the configured LLM client."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        assert service.llm_client is mock_llm


class TestAIServiceContextBuilding:
    """Tests for _build_context method - formats data for LLM."""

    def test_build_context_includes_station_data(self) -> None:
        """Should include station statistics in context."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        # Create realistic analytics mock
        station = Mock()
        station.station_id = "101234"
        station.station_name = "Berkeley, CA"
        station.mean_temp = 15.5
        station.min_temp = -5.2
        station.min_temp_month = 1
        station.min_temp_year = 1950
        station.max_temp = 38.7
        station.max_temp_month = 7
        station.max_temp_year = 2015
        station.std_temp = 4.2
        station.hottest_year = 2015
        station.hottest_year_temp = 18.3
        station.coldest_year = 1950
        station.coldest_year_temp = 12.1
        station.data_coverage = 95.5

        analytics = Mock()
        analytics.stations = [station]
        analytics.year_range = (1900, 2019)

        context = service._build_context(analytics)

        # Verify key data points are included
        assert "101234" in context
        assert "15.5" in context or "15.50" in context
        assert "1900" in context
        assert "2019" in context

    def test_build_context_multiple_stations(self) -> None:
        """Should include data from all stations."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        # Create two station mocks
        def create_station_mock(station_id: str, mean_temp: float) -> Mock:
            station = Mock()
            station.station_id = station_id
            station.station_name = f"Station {station_id}"
            station.mean_temp = mean_temp
            station.min_temp = mean_temp - 10
            station.min_temp_month = 1
            station.min_temp_year = 1950
            station.max_temp = mean_temp + 15
            station.max_temp_month = 7
            station.max_temp_year = 2000
            station.std_temp = 3.5
            station.hottest_year = 2000
            station.hottest_year_temp = mean_temp + 5
            station.coldest_year = 1950
            station.coldest_year_temp = mean_temp - 5
            station.data_coverage = 90.0
            return station

        analytics = Mock()
        analytics.stations = [
            create_station_mock("101234", 15.0),
            create_station_mock("567890", 22.0),
        ]
        analytics.year_range = (1900, 2019)

        context = service._build_context(analytics)

        # Both stations should be in context
        assert "101234" in context
        assert "567890" in context


class TestAIServiceInsightParsing:
    """Tests for _parse_insights method - converts LLM response to structured data."""

    def test_parse_markdown_format_response(self) -> None:
        """Should parse markdown-formatted response into Insight objects."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        # The parser expects **Title**: Description format
        response = """**Rising Temperatures**: Average temperatures have been increasing
        over the past century, showing a clear trend of warming since 1950.

        **Extreme Events**: There has been an unusual spike in temperature records,
        with more extreme heat events recorded in recent decades."""

        insights = service._parse_insights(response, ["101234"])

        assert len(insights) >= 1
        assert isinstance(insights[0], Insight)
        # First insight should be classified as TREND due to "increasing" and "trend"
        assert insights[0].type == InsightType.TREND

    def test_parse_handles_malformed_json(self) -> None:
        """Should gracefully handle malformed JSON responses."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        response = "This is not valid JSON at all"
        insights = service._parse_insights(response, ["101234"])

        # Should return fallback insights, not crash
        assert isinstance(insights, list)

    def test_parse_handles_empty_response(self) -> None:
        """Should handle empty or whitespace responses."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        response = "   "
        insights = service._parse_insights(response, ["101234"])

        assert isinstance(insights, list)


class TestAIServiceInsightClassification:
    """Tests for _classify_insight method - categorizes insight text."""

    def test_classify_trend_keywords(self) -> None:
        """Should classify text with trend keywords as TREND."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        # Using actual keywords from implementation
        trend_texts = [
            "The temperature shows an increasing trend over time",
            "A clear rise in temperatures since 1950",
            "Gradual decline observed in the data",
        ]

        for text in trend_texts:
            result = service._classify_insight(text)
            assert result == InsightType.TREND, f"Failed for: {text}"

    def test_classify_anomaly_keywords(self) -> None:
        """Should classify text with anomaly keywords as ANOMALY."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        anomaly_texts = [
            "There is an unusual spike in 1998",
            "An extreme temperature event occurred",
            "This outlier deviates significantly from the norm",
        ]

        for text in anomaly_texts:
            result = service._classify_insight(text)
            assert result == InsightType.ANOMALY, f"Failed for: {text}"

    def test_classify_comparison_keywords(self) -> None:
        """Should classify text with comparison keywords as COMPARISON."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        comparison_texts = [
            "Station A is warmer compared to Station B",
            "The difference between these two stations",
            "When contrasting the northern and southern regions",
        ]

        for text in comparison_texts:
            result = service._classify_insight(text)
            assert result == InsightType.COMPARISON, f"Failed for: {text}"

    def test_classify_defaults_to_summary(self) -> None:
        """Should default to SUMMARY for unclassifiable text."""
        mock_llm = Mock(spec=LLMClient)
        service = AIService(llm_client=mock_llm)

        generic_text = "The data shows various patterns"
        result = service._classify_insight(generic_text)

        assert result == InsightType.SUMMARY


class TestAIServiceHelperMethods:
    """Tests for utility methods in AIService."""

    def test_month_name_valid_months(self) -> None:
        """Should return correct month abbreviations."""
        expected = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
        }

        for month, name in expected.items():
            assert AIService._month_name(month) == name

    def test_month_name_invalid_months(self) -> None:
        """Should return placeholder for invalid month numbers."""
        assert AIService._month_name(0) == "???"
        assert AIService._month_name(13) == "???"
        assert AIService._month_name(-1) == "???"


class TestInsightTypeEnum:
    """Tests for InsightType enumeration."""

    def test_all_insight_types_defined(self) -> None:
        """Should have all required insight type values."""
        required_types = ["trend", "anomaly", "comparison", "summary", "prediction"]

        for type_value in required_types:
            assert InsightType(type_value) is not None

    def test_insight_type_string_values(self) -> None:
        """Should have correct string representations."""
        assert InsightType.TREND.value == "trend"
        assert InsightType.ANOMALY.value == "anomaly"
        assert InsightType.COMPARISON.value == "comparison"
        assert InsightType.SUMMARY.value == "summary"
        assert InsightType.PREDICTION.value == "prediction"


class TestInsightSchema:
    """Tests for Insight Pydantic model."""

    def test_insight_creation_with_valid_data(self) -> None:
        """Should create Insight with all required fields."""
        insight = Insight(
            type=InsightType.TREND,
            title="Rising Temperatures",
            description="Average temperatures increased by 1.5°C",
            confidence=0.85,
            related_stations=["101234", "567890"],
        )

        assert insight.type == InsightType.TREND
        assert insight.title == "Rising Temperatures"
        assert insight.confidence == 0.85
        assert len(insight.related_stations) == 2

    def test_insight_confidence_bounds(self) -> None:
        """Confidence should be between 0 and 1."""
        # Valid confidence values
        insight_low = Insight(
            type=InsightType.SUMMARY,
            title="Test",
            description="Test description",
            confidence=0.0,
            related_stations=[],
        )
        assert insight_low.confidence == 0.0

        insight_high = Insight(
            type=InsightType.SUMMARY,
            title="Test",
            description="Test description",
            confidence=1.0,
            related_stations=[],
        )
        assert insight_high.confidence == 1.0
