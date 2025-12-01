# =============================================================================
# EC2 Instance
# =============================================================================

# Key Pair for SSH access
resource "aws_key_pair" "app" {
  key_name   = "${var.app_name}-key"
  public_key = tls_private_key.app.public_key_openssh
}

# Generate SSH key pair
resource "tls_private_key" "app" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Save private key locally
resource "local_file" "private_key" {
  content         = tls_private_key.app.private_key_pem
  filename        = "${path.module}/keys/${var.app_name}-key.pem"
  file_permission = "0400"
}

# EC2 Instance
resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux_2023.id
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.app.key_name
  vpc_security_group_ids      = [aws_security_group.app.id]
  subnet_id                   = aws_subnet.public.id
  associate_public_ip_address = true

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    grok_api_key = var.grok_api_key
    app_name     = var.app_name
  }))

  tags = {
    Name = "${var.app_name}-server"
  }

  # Wait for instance to be ready
  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IP for stable public IP
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  tags = {
    Name = "${var.app_name}-eip"
  }

  depends_on = [aws_internet_gateway.main]
}
