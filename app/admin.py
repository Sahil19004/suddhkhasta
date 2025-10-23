from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Userdetails)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'mrp', 'discount', 'quantity', 'badge']
    list_filter = ['badge', 'is_active']
    search_fields = ['name']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name','description','description2')
        }),
        ('Pricing', {
            'fields': ('mrp', 'price', 'discount'),
            'description': 'Enter any 2 values - the 3rd will be calculated automatically'
        }),
        ('Images', {
            'fields': ('image1', 'image2', 'image3')
        }),
        ('Inventory & Status', {
            'fields': ('quantity', 'badge', 'is_active')
        }),
    )

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'customer_name', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']


admin.site.register(Contact)
admin.site.register(VideoFeedback)
admin.site.register(Coupon)

@admin.register(ShippingCharge)
class ShippingChargeAdmin(admin.ModelAdmin):
    """
    Admin interface for ShippingCharge model
    """
    list_display = [
        'state_name', 
        'shipping_charge', 
        'is_active', 
        'created_at', 
        'updated_at'
    ]
    
    list_filter = [
        'is_active',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'state_name'
    ]
    
    list_editable = [
        'shipping_charge',
        'is_active'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('State Information', {
            'fields': ('state_name',)
        }),
        ('Shipping Details', {
            'fields': ('shipping_charge', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ['state_name']
    list_per_page = 25
    
    actions = ['activate_shipping', 'deactivate_shipping']
    
    def activate_shipping(self, request, queryset):
        """Admin action to activate selected shipping charges"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} shipping charge(s) activated successfully.')
    
    activate_shipping.short_description = "Activate selected shipping charges"
    
    def deactivate_shipping(self, request, queryset):
        """Admin action to deactivate selected shipping charges"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} shipping charge(s) deactivated.')
    
    deactivate_shipping.short_description = "Deactivate selected shipping charges"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['payment_id', 'amount', 'status', 'created_at']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'full_name', 'total_amount', 'payment_status', 'status', 'created_at']
    list_filter = ['status', 'payment_status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'full_name', 'email', 'tracking_id']
    readonly_fields = ['order_number', 'tracking_id', 'created_at', 'updated_at']
    inlines = [OrderItemInline, PaymentInline]
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'tracking_id', 'user', 'status')
        }),
        ('Customer Information', {
            'fields': ('full_name', 'email', 'phone', 'alt_phone')
        }),
        ('Shipping Address', {
            'fields': ('address', 'city', 'state', 'pincode', 'landmark')
        }),
        ('Order Amounts', {
            'fields': ('subtotal', 'shipping_charge', 'discount', 'total_amount')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'payment_status', 'amount_paid')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_id', 'order', 'amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['payment_id', 'order__order_number']
    readonly_fields = ['created_at']

admin.site.register(OrderItem)