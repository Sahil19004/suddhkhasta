# cart.py or your cart implementation file
from decimal import Decimal
from django.conf import settings

class Cart:
    def __init__(self, request):
        """
        Initialize the cart
        """
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID, {})
        
        # Ensure cart has proper structure
        if not isinstance(cart, dict):
            cart = {}
        
        if 'items' not in cart:
            cart['items'] = {}
        
        if 'coupon' not in cart:
            cart['coupon'] = None
            
        self.cart = cart

    def add(self, product, quantity=1, override_quantity=False):
        """
        Add a product to the cart or update its quantity.
        """
        product_id = str(product.id)
        
        if product_id not in self.cart['items']:
            self.cart['items'][product_id] = {
                'quantity': 0,
                'price': str(product.price)
            }
        
        if override_quantity:
            self.cart['items'][product_id]['quantity'] = quantity
        else:
            self.cart['items'][product_id]['quantity'] += quantity
            
        self.save()

    def save(self):
        """
        Mark the session as "modified" to make sure it gets saved
        """
        self.session[settings.CART_SESSION_ID] = self.cart
        self.session.modified = True

    def remove(self, product_id):
        """
        Remove a product from the cart.
        """
        product_id = str(product_id)
        if product_id in self.cart['items']:
            del self.cart['items'][product_id]
            self.save()

    def update_quantity(self, product_id, quantity):
        """
        Update the quantity of a product in the cart.
        """
        product_id = str(product_id)
        if product_id in self.cart['items']:
            if quantity <= 0:
                self.remove(product_id)
            else:
                self.cart['items'][product_id]['quantity'] = quantity
                self.save()

    def __iter__(self):
        """
        Iterate over the items in the cart and get the products from the database.
        """
        from .models import Product  # Import here to avoid circular imports
        
        product_ids = self.cart['items'].keys()
        products = Product.objects.filter(id__in=product_ids)
        cart = self.cart.copy()
        
        for product in products:
            cart['items'][str(product.id)]['product'] = product
            
        for item in cart['items'].values():
            item['price'] = Decimal(item['price'])
            item['total_price'] = item['price'] * item['quantity']
            yield item

    def __len__(self):
        """
        Count all items in the cart.
        """
        return sum(item['quantity'] for item in self.cart['items'].values())

    def get_subtotal_price(self):
        """
        Get the subtotal price of all items in the cart before discount.
        """
        return sum(Decimal(item['price']) * item['quantity'] 
                  for item in self.cart['items'].values())

    def get_coupon_discount(self):
        """
        Get the discount amount from the applied coupon.
        """
        if self.cart.get('coupon'):
            try:
                discount_percent = Decimal(str(self.cart['coupon']['discount_percent']))
                return (self.get_subtotal_price() * discount_percent) / 100
            except (KeyError, ValueError, TypeError):
                return Decimal('0')
        return Decimal('0')

    def get_total_price(self):
        """
        Get the total price after applying coupon discount.
        """
        return self.get_subtotal_price() - self.get_coupon_discount()

    def apply_coupon(self, coupon_code, discount_percent):
        """
        Apply a coupon to the cart.
        """
        self.cart['coupon'] = {
            'code': coupon_code,
            'discount_percent': discount_percent
        }
        self.save()

    def remove_coupon(self):
        """
        Remove the applied coupon from the cart.
        """
        self.cart['coupon'] = None
        self.save()

    def clear(self):
        """
        Remove cart from session
        """
        del self.session[settings.CART_SESSION_ID]
        self.save()