from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


class Userdetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.user.email}"
class Banner(models.Model):
    image1=models.ImageField(upload_to="gallery")
    image2=models.ImageField(upload_to="gallery")
    image3=models.ImageField(upload_to="gallery")
class Product(models.Model):
    # Badge choices
    BADGE_CHOICES = [
        ('new', 'New'),
        ('trending', 'Trending'),
        ('sale', 'Sale'),
        ('none', 'None'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=200)
    description = models.TextField()
    description2=models.TextField()
    
    # Pricing
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, 
                                  validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Images (3 fields)
    image1 = models.ImageField(upload_to='products/')
    image2 = models.ImageField(upload_to='products/', blank=True, null=True)
    image3 = models.ImageField(upload_to='products/', blank=True, null=True)
    
    # Inventory
    quantity = models.PositiveIntegerField(default=0)


    
    # Status
    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, default='none')
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Auto-calculate missing pricing field
        if self.mrp:
            if self.price and not self.discount:
                # Calculate discount from MRP and price
                if self.mrp > self.price:
                    self.discount = round(((self.mrp - self.price) / self.mrp) * 100, 2)
                else:
                    self.discount = 0
            elif self.discount and not self.price:
                # Calculate price from MRP and discount
                self.price = self.mrp - (self.mrp * self.discount / 100)
            elif not self.price and not self.discount:
                # Default: no discount
                self.price = self.mrp
                self.discount = 0
        
        super().save(*args, **kwargs)
    
    @property
    def discount_percentage(self):
        return self.discount if self.discount else 0
    
    @property
    def is_in_stock(self):
        return self.quantity > 0

class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer_name = models.CharField(max_length=100)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.product.name} - {self.rating} stars"
    


class Contact(models.Model):
    name=models.CharField(max_length=20)
    email=models.EmailField()
    phone=models.CharField(max_length=11)
    message=models.TextField()

    def __str__(self):
        return self.name + self.phone


class VideoFeedback(models.Model):
    name=models.CharField(max_length=20)
    location=models.CharField(max_length=20)
    description=models.TextField()
    video=models.FileField(upload_to='videos/', blank=True, null=True)

    def __str__(self):
        return self.name + " " + self.location
    

# app/models.py
class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)])
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)
    max_usage = models.PositiveIntegerField(default=100)
    used_count = models.PositiveIntegerField(default=0)
    
    def is_valid(self):
        now = timezone.now()
        return self.active and self.used_count < self.max_usage and self.valid_from <= now <= self.valid_to
    
    def __str__(self):
        return f"{self.code} ({self.discount_percent}% off)"
    

from django.db import models
from django.core.validators import MinValueValidator

class ShippingCharge(models.Model):
    """
    Model to store shipping charges for different states
    """
    
    state_name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Name of the state"
    )
    
    shipping_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Shipping charge for this state"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this shipping charge is active"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Shipping Charge"
        verbose_name_plural = "Shipping Charges"
        ordering = ['state_name']
    
    def __str__(self):
        return f"{self.state_name} - {self.shipping_charge}"
    

class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('partial', 'Partial Payment'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD = [
        ('cod', 'Cash on Delivery'),
        ('upi', 'UPI Payment'),
        ('card', 'Credit/Debit Card'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    order_number = models.CharField(max_length=20, unique=True)
    tracking_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Customer Information
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    alt_phone = models.CharField(max_length=15, blank=True, null=True)
    
    # Shipping Address
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=6)
    landmark = models.CharField(max_length=100, blank=True, null=True)
    
    # Order Details
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment Information
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD, default='cod')
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Order Status
    status = models.CharField(max_length=10, choices=ORDER_STATUS, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.order_number} - {self.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)
    
    def generate_order_number(self):
        import random
        import string
        return f"ORD{''.join(random.choices(string.digits, k=10))}"
    
    def get_remaining_amount(self):
        return self.total_amount - self.amount_paid
    
    def get_payment_qr_data(self):
        # Generate UPI payment URL (you can customize this)
        upi_id = "your-merchant@upi"  # Replace with your UPI ID
        amount = float(self.get_remaining_amount())
        return f"upi://pay?pa={upi_id}&pn=Your%20Store&am={amount}&cu=INR&tn=Order%20{self.order_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    def get_total(self):
        return self.quantity * self.price

class Payment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    payment_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_details = models.JSONField(blank=True, null=True)  # Store payment gateway response
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment {self.payment_id} - ₹{self.amount}"
