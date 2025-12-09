from django.shortcuts import render, redirect
from .models import *
from django.http import JsonResponse
from django.contrib.auth.models import User,auth
import logging
from decimal import Decimal
from django.conf import settings
from django.db.models import Avg, Count
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login
from django.views.decorators.csrf import csrf_protect,ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.db import transaction, IntegrityError
from django.contrib import messages
import json
from .cart import Cart
from django.contrib.auth.decorators import login_required
# Create your views here.
from .cart import Cart
import re
logger = logging.getLogger('app')
def indexpage(request):
 cart=Cart(request)
 cart_count=len(cart)
 products =Product.objects.all()
 banner = Banner.objects.get(id=3)
 image1 = banner.image1
 image2 = banner.image2
 image3 = banner.image3

 print(image1,image2,image3)

 video=VideoFeedback.objects.all()
 context={
     'products':products,
     'video':video,
     'cart_count':cart_count,
     'image1':image1,
     'image2':image2,
     'image3':image3

 } 
 print(context)
 return render(request,'index.html',context)


@require_POST
def submit_review(request, myid):
    """Handle review submission via AJAX"""
    try:
        # Get the product
        product = get_object_or_404(Product, id=myid)
        
        # Get form data
        rating = request.POST.get('rating')
        customer_name = request.POST.get('name', '').strip()
        comment = request.POST.get('review_text', '').strip()
        
        # Validate data
        if not rating:
            return JsonResponse({'success': False, 'error': 'Rating is required'})
        
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                return JsonResponse({'success': False, 'error': 'Rating must be between 1 and 5'})
        except ValueError:
            return JsonResponse({'success': False, 'error': 'Invalid rating value'})
        
        if not customer_name:
            return JsonResponse({'success': False, 'error': 'Name is required'})
        
        if not comment:
            return JsonResponse({'success': False, 'error': 'Review text is required'})
        
        if len(customer_name) > 100:
            return JsonResponse({'success': False, 'error': 'Name must be 100 characters or less'})
        
        # Create the review
        review = ProductReview.objects.create(
            product=product,
            customer_name=customer_name,
            rating=rating,
            comment=comment
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Review submitted successfully!',
            'review_id': review.id
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'An error occurred: {str(e)}'
        })
@csrf_protect
def login(request):
    """
    Handle user login
    """
    # Redirect if user is already authenticated
    if request.user.is_authenticated:
        return redirect('/')
    
    if request.method == 'POST':
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')
        
        logger.info(f'Login attempt for email: {email}')
        
        # Basic validation
        if not email or not password:
            messages.error(request, 'Please enter both email and password')
            return render(request, 'Login.html')
        
        # Email format validation
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            messages.error(request, 'Please enter a valid email address')
            return render(request, 'Login.html')
        
        try:
            # Get user by email
            user = User.objects.get(email=email)
            username = user.username
            
            # Authenticate with username and password
            authenticated_user = authenticate(username=username, password=password)
            
            if authenticated_user is not None:
                auth_login(request, authenticated_user)
                logger.info(f'Successful login for email: {email} (ID: {user.id})')
                messages.success(request, 'Welcome back!')
                
                # Redirect to next page or dashboard
                next_page = request.GET.get('next', '/')
                return redirect(next_page)
            else:
                logger.warning(f'Failed login attempt - incorrect password for email: {email}')
                messages.error(request, 'Invalid email or password')
                return render(request, 'Login.html')
                
        except User.DoesNotExist:
            logger.warning(f'Failed login attempt - email not found: {email}')
            messages.error(request, 'Invalid email or password')
            return render(request, 'Login.html')
        
        except Exception as e:
            logger.error(f'Unexpected error during login for {email}: {str(e)}', exc_info=True)
            messages.error(request, 'An error occurred. Please try again.')
            return render(request, 'Login.html')
    
    else:
        # GET request - show login form
        logger.info('Login page accessed')
    
    return render(request, 'Login.html')



def signup(request):
    """
    Handle user registration with proper logging
    """
    if request.method == 'POST':
        # Get form data
        fullname = request.POST.get('fullname', '').strip()
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')
        phone=request.POST.get('phone')
    
        # Log the signup attempt (without sensitive data)
        logger.info(f'Signup attempt for email: {email}')
        
        # Basic required field check
        if not fullname or not email or not password:
            logger.warning(f'Signup failed - missing required fields for email: {email}')
            messages.error(request, 'All fields are required')
            return render(request, 'Signup.html')
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            logger.warning(f'Signup failed - email already exists: {email}')
            messages.error(request, 'An account with this email already exists')
            return render(request, 'Signup.html')
        
        # Create user account
        try:
            with transaction.atomic():
                # Split fullname into first and last name
                name_parts = fullname.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                
                # Create username from email (before @)
                username = email.split('@')[0]
                
                # Make sure username is unique
                original_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{original_username}{counter}"
                    counter += 1
                
                # Create User using Django's built-in User model
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                
                # Create Userdetails (extended user profile)
                user_details = Userdetails.objects.create(
                    user=user,
                    phone=phone # You can add phone field to the form later
                )
                
                logger.info(f'User successfully created: {email} (username: {username}, ID: {user.id})')
                
                # Authenticate and login user
                authenticated_user = authenticate(username=username, password=password)
                if authenticated_user:
                    auth_login(request, authenticated_user)
                    logger.info(f'User successfully logged in after signup: {email} (ID: {user.id})')
                    messages.success(request, 'Account created successfully! Welcome!')
                    return redirect('/')  # Replace with your redirect URL
                else:
                    logger.error(f'Authentication failed after user creation: {email} (ID: {user.id})')
                    messages.error(request, 'Account created but login failed. Please try logging in manually.')
                    return redirect('login')
    
        except IntegrityError as e:
            logger.error(f'Database integrity error during signup for {email}: {str(e)}', exc_info=True)
            messages.error(request, 'An error occurred while creating your account. Please try again.')
            return render(request, 'Signup.html')
        
        except Exception as e:
            logger.error(f'Unexpected error during signup for {email}: {str(e)}', exc_info=True)
            messages.error(request, 'An unexpected error occurred. Please try again.')
            return render(request, 'Signup.html')
    
    else:
        # GET request - show signup form
        logger.info('Signup page accessed')
    
    return render(request, "Signup.html")

def logout(request):
    auth.logout(request)

    return redirect('/')

@ensure_csrf_cookie
def product_detail(request, myid):
    """Product detail view with proper cart state checking"""
    # Get the single product (404 if not found)
    product = get_object_or_404(Product, id=myid)
    cart = Cart(request)
    cart_count=len(cart)
  
    # Check if product is in cart - Fixed logic
    product_in_cart = False
    if hasattr(cart, 'cart') and 'items' in cart.cart:
        # Check if product ID exists in cart items
        product_in_cart = str(myid) in cart.cart['items']
    else:
        # Fallback method - iterate through cart
        for item in cart:
            if str(item['product'].id) == str(myid):
                product_in_cart = True
                break
    
    # Get all other products except the current one
    products = Product.objects.exclude(id=myid)
    
    # Get reviews for this product
    reviews = product.reviews.all().order_by('-created_at')
    
    # Average rating
    average_rating = reviews.aggregate(avg=Avg('rating'))['avg'] or 0
    
    # Total reviews
    total_reviews = reviews.count()
    
    # Rating distribution (how many 5★, 4★, etc.)
    rating_counts = reviews.values('rating').annotate(count=Count('rating'))
    distribution = {i: 0 for i in range(1, 6)}  # initialize 1–5 stars with 0
    for rc in rating_counts:
        distribution[rc['rating']] = rc['count']
    
    # Calculate percentages for the rating bars
    rating_percentages = {}
    if total_reviews > 0:
        for rating in range(1, 6):
            rating_percentages[rating] = round((distribution[rating] / total_reviews) * 100)
    else:
        rating_percentages = {i: 0 for i in range(1, 6)}
    
    context = {
        'product': product,
        'products': products,
        'reviews': reviews,
        'average_rating': round(average_rating, 1),
        'total_reviews': total_reviews,
        'distribution': distribution,
        'rating_percentages': rating_percentages,
        'product_in_cart': product_in_cart,
          'cart_count':cart_count

    }
    return render(request, "Product.html", context)
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

@require_POST
def cart_add(request, product_id):
    """Add product to cart with proper error handling"""
    try:
        cart = Cart(request)
        product = get_object_or_404(Product, id=product_id)
        quantity = int(request.POST.get('quantity', 1))
        
        # Validate quantity
        if quantity < 1:
            quantity = 1
        
        # Add product to cart
        cart.add(product=product, quantity=quantity)
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'cart_count': len(cart),
                'message': 'Product added to cart successfully'
            })
        
        return redirect('cart_detail')
        
    except ValueError:
        error_msg = 'Invalid quantity provided'
    except Exception as e:
        logger.error(f"Error in cart_add: {e}")
        error_msg = 'Error adding product to cart'
    
    # Handle errors
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'success': False,
            'message': error_msg
        }, status=400)
    return redirect('cart_detail')

@require_POST
def cart_update(request, product_id):
    """Update cart item quantity"""
    try:
        cart = Cart(request)
        quantity = int(request.POST.get('quantity', 1))
        
        # Validate quantity
        if quantity < 1:
            quantity = 1
        
        # Update the quantity
        cart.update_quantity(product_id, quantity)
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            # Calculate the updated values
            item_total = Decimal('0')
            cart_total = Decimal('0')
            
            # Get item total
            product_id_str = str(product_id)
            if hasattr(cart, 'cart') and 'items' in cart.cart and product_id_str in cart.cart['items']:
                item_data = cart.cart['items'][product_id_str]
                price = Decimal(str(item_data['price']))
                item_total = price * quantity
            
            # Calculate cart total
            if hasattr(cart, 'cart') and 'items' in cart.cart:
                for item_id, item_data in cart.cart['items'].items():
                    item_quantity = int(item_data['quantity'])
                    item_price = Decimal(str(item_data['price']))
                    cart_total += item_price * item_quantity
            
            response_data = {
                'success': True,
                'item_total': float(item_total),
                'cart_total': float(cart_total),
                'cart_count': len(cart)
            }
            
            # Add coupon data if a coupon is applied
            if hasattr(cart, 'cart') and cart.cart.get('coupon'):
                discount_percent = Decimal(str(cart.cart['coupon']['discount_percent']))
                coupon_discount = (cart_total * discount_percent) / 100
                response_data['coupon_discount'] = float(coupon_discount)
            
            return JsonResponse(response_data)
        
        return redirect('cart_detail')
        
    except ValueError:
        error_msg = 'Invalid quantity provided'
    except Exception as e:
        logger.error(f"Error in cart_update: {e}")
        error_msg = 'Error updating cart'
    
    # Handle errors
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'success': False,
            'message': error_msg
        }, status=400)
    return redirect('cart_detail')

@require_POST
def cart_remove(request, product_id):
    """Remove product from cart"""
    try:
        cart = Cart(request)
        cart.remove(product_id)
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            # Calculate remaining totals
            response_data = {
                'success': True,
                'cart_count': len(cart),
                'message': 'Product removed from cart'
            }
            
            # Add updated totals if cart is not empty
            if len(cart) > 0:
                cart_total = Decimal('0')
                if hasattr(cart, 'cart') and 'items' in cart.cart:
                    for item_id, item_data in cart.cart['items'].items():
                        item_quantity = int(item_data['quantity'])
                        item_price = Decimal(str(item_data['price']))
                        cart_total += item_price * item_quantity
                
                response_data['cart_total'] = float(cart_total)
                
                # Add coupon data if a coupon is applied
                if hasattr(cart, 'cart') and cart.cart.get('coupon'):
                    discount_percent = Decimal(str(cart.cart['coupon']['discount_percent']))
                    coupon_discount = (cart_total * discount_percent) / 100
                    response_data['coupon_discount'] = float(coupon_discount)
            
            return JsonResponse(response_data)
        
        return redirect('cart_detail')
        
    except Exception as e:
        logger.error(f"Error in cart_remove: {e}")
        error_msg = 'Error removing item from cart'
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'message': error_msg
            }, status=400)
        return redirect('cart_detail')

def cart_detail(request):
    """Cart detail view"""
    cart = Cart(request)
    cart_count = len(cart)
    
    # Get coupon message from session if exists
    coupon_message = request.session.pop('coupon_message', None)
    
    return render(request, 'addcart.html', {
        'cart': cart,
        'cart_count': cart_count,
        'coupon_message': coupon_message
    })

@require_POST
def cart_apply_coupon(request):
    """Apply coupon to cart with safe null checks"""
    try:
        cart = Cart(request)
        coupon_code = request.POST.get('coupon_code', '').strip().upper()
        
        if not coupon_code:
            message = "Please enter a coupon code."
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': message
                })
            request.session['coupon_message'] = message
            return redirect('cart_detail')
        
        # Safe check for existing coupon with proper null handling
        cart_data = getattr(cart, 'cart', None) if cart else None
        existing_coupon = None
        if cart_data and isinstance(cart_data, dict):
            existing_coupon = cart_data.get('coupon')
        
        # Check if coupon already applied
        if existing_coupon and existing_coupon.get('code') == coupon_code:
            message = "This coupon is already applied."
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': message
                })
            request.session['coupon_message'] = message
            return redirect('cart_detail')
        
        try:
            coupon = Coupon.objects.get(code=coupon_code, active=True)
            if coupon.is_valid():
                # Apply coupon to cart
                cart.apply_coupon(coupon.code, float(coupon.discount_percent))
                coupon.used_count += 1
                coupon.save()
                
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    # Get discount and total with safe methods
                    try:
                        discount_amount = float(cart.get_coupon_discount()) if hasattr(cart, 'get_coupon_discount') else 0.0
                        total_price = float(cart.get_total_price()) if hasattr(cart, 'get_total_price') else 0.0
                        subtotal_price = float(cart.get_subtotal_price()) if hasattr(cart, 'get_subtotal_price') else 0.0
                    except:
                        discount_amount = 0.0
                        total_price = 0.0
                        subtotal_price = 0.0
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Coupon "{coupon_code}" applied successfully!',
                        'coupon_code': coupon_code,
                        'discount_percent': float(coupon.discount_percent),
                        'discount_amount': discount_amount,
                        'total_price': total_price,
                        'subtotal_price': subtotal_price
                    })
                
                return redirect('cart_detail')
            else:
                message = "This coupon is no longer valid."
        except Coupon.DoesNotExist:
            message = "Invalid coupon code."
        
    except Exception as e:
        logger.error(f"Error in cart_apply_coupon: {e}")
        message = "Error applying coupon. Please try again."
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({
            'success': False,
            'message': message
        })
    
    # For non-AJAX requests, redirect with a message
    request.session['coupon_message'] = message
    return redirect('cart_detail')

@require_POST
def cart_remove_coupon(request):
    """Remove coupon from cart with safe null checks"""
    try:
        cart = Cart(request)
        
        # Safe check for existing coupon
        cart_data = getattr(cart, 'cart', None) if cart else None
        existing_coupon = None
        if cart_data and isinstance(cart_data, dict):
            existing_coupon = cart_data.get('coupon')
        
        # Check if any coupon is applied
        if not existing_coupon:
            message = "No coupon is currently applied."
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': message
                })
            request.session['coupon_message'] = message
            return redirect('cart_detail')
        
        cart.remove_coupon()
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            try:
                total_price = float(cart.get_total_price()) if hasattr(cart, 'get_total_price') else 0.0
                subtotal_price = float(cart.get_subtotal_price()) if hasattr(cart, 'get_subtotal_price') else 0.0
            except:
                total_price = 0.0
                subtotal_price = 0.0
                
            return JsonResponse({
                'success': True,
                'message': 'Coupon removed successfully',
                'total_price': total_price,
                'subtotal_price': subtotal_price
            })
        
        return redirect('cart_detail')
        
    except Exception as e:
        logger.error(f"Error in cart_remove_coupon: {e}")
        message = "Error removing coupon. Please try again."
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'message': message
            })
        
        request.session['coupon_message'] = message
        return redirect('cart_detail')
def contact(request):
    cart=Cart(request)
    cart_count=len(cart)
    if request.method=="POST":
        name=request.POST['name']
        email=request.POST['email']
        phone=request.POST['phone']
        message=request.POST['message']

        obj=Contact(name=name,email=email,phone=phone,message=message).save()
        messages.success(request, 'Data successfully submitted! We will contact you soon.')
        
        # Redirect to avoid form resubmission on page refresh
        return redirect('contact')  # Replace 'contact' with your URL name

    return render(request,'Contact.html',{'cart_count':cart_count})

def terms(request):
    cart=Cart(request)
    cart_count=len(cart)
    return render(request,"TOS.html",{'cart_count':cart_count})

def shippingpol(request):
    cart=Cart(request)
    cart_count=len(cart)
    return render(request,"Shipping.html",{'cart_count':cart_count})

# app/views.py - add this debug view
def cart_debug(request):
    cart = Cart(request)
    debug_info = {
        'session_key': request.session.session_key,
        'cart_structure': cart.cart,
        'items_count': len(cart.cart['items']),
        'has_coupon': bool(cart.cart.get('coupon')),
        'cart_length': len(cart),
    }
    
    # Try to iterate through cart items
    try:
        items_info = []
        for item in cart:
            items_info.append({
                'product_id': item['product'].id,
                'name': item['product'].name,
                'quantity': item['quantity'],
                'price': float(item['price']),
                'total_price': float(item['total_price'])
            })
        debug_info['items'] = items_info
    except Exception as e:
        debug_info['iteration_error'] = str(e)
    
    return JsonResponse(debug_info)
@login_required
def orderpage(request):
    # Get filter from request
    cart=Cart(request)
    cart_count=len(cart)
    filter_type = request.GET.get('filter', 'all')
    
    # Base queryset - only get orders for logged-in user
    orders = Order.objects.filter(user=request.user).select_related('user').prefetch_related('items__product').order_by('-created_at')
    
    # Apply filters
    if filter_type == 'delivered':
        orders = orders.filter(status='delivered')
    elif filter_type == 'processing':
        orders = orders.filter(status__in=['pending', 'confirmed', 'processing', 'shipped'])
    elif filter_type == 'cancelled':
        orders = orders.filter(status='cancelled')
    # 'all' shows all orders
    
    # Prepare order data for template
    orders_data = []
    for order in orders:
        # Get all items for this order
        order_items = order.items.all()
        
        # Prepare items data
        items_data = []
        item_count = 0
        
        for item in order_items:
            # Get product image URL safely
            image_url = ''
            if item.product and hasattr(item.product, 'image1') and item.product.image1:
                try:
                    image_url = item.product.image1.url
                except:
                    image_url = ''
            
            items_data.append({
                'product_name': item.product.name if item.product else 'Product Not Available',
                'quantity': item.quantity,
                'price': float(item.price),
                'total': float(item.quantity * item.price),
                'image_url': image_url
            })
            item_count += item.quantity
        
        # Get status display text and CSS class
        status_display = get_status_display(order.status)
        status_class = get_status_class(order.status)
        payment_status_display = get_payment_status_display(order.payment_status)
        
        orders_data.append({
            'order_number': order.order_number,
            'created_at': order.created_at,
            'tracking_id': order.tracking_id,
            'status_display': status_display,
            'status_class': status_class,
            'payment_status': order.payment_status,
            'payment_status_display': payment_status_display,
            'payment_method': order.get_payment_method_display(),
            'total_amount': float(order.total_amount),
            'items': items_data,
            'item_count': item_count,
        })
    
    # Calculate filter counts
    filter_counts = {
        'all': Order.objects.filter(user=request.user).count(),
        'delivered': Order.objects.filter(user=request.user, status='delivered').count(),
        'processing': Order.objects.filter(
            user=request.user, 
            status__in=['pending', 'confirmed', 'processing', 'shipped']
        ).count(),
        'cancelled': Order.objects.filter(user=request.user, status='cancelled').count(),
    }
    
    context = {
        'orders': orders_data,
        'current_filter': filter_type,
        'filter_counts': filter_counts,
        'cart_count':cart_count
    }
    
    return render(request, "Order.html", context)

def get_status_display(status):
    """Convert status code to display text"""
    status_map = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    }
    return status_map.get(status, status.title())

def get_status_class(status):
    """Get CSS class for status badge"""
    status_class_map = {
        'pending': 'pending',
        'confirmed': 'processing',
        'processing': 'processing',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
    }
    return status_class_map.get(status, 'pending')

def get_payment_status_display(payment_status):
    """Convert payment status code to display text"""
    payment_status_map = {
        'pending': 'Payment Pending',
        'completed': 'Paid',
        'failed': 'Payment Failed',
        'refunded': 'Refunded',
        'partial': 'Partial Payment'
    }
    return payment_status_map.get(payment_status, payment_status.title())
logger = logging.getLogger(__name__)

@ensure_csrf_cookie
@login_required
def checkout(request):
    cart = Cart(request)
    
    if len(cart) == 0:
        return redirect('cart_detail')
    
    try:
        # Get shipping charges for all active states
        shipping_charges = ShippingCharge.objects.filter(is_active=True)
        
        # Calculate cart totals
        subtotal = cart.get_subtotal_price()
        discount = getattr(cart, 'get_coupon_discount', lambda: Decimal('0'))()
        
        # Get cart items count
        item_count = sum(item['quantity'] for item in cart)
        
        context = {
            'cart': cart,
            'cart_count': len(cart),
            'item_count': item_count,
            'subtotal': float(subtotal),
            'discount': float(discount),
            'shipping_charges': shipping_charges,
        }
        return render(request, 'checkouts.html', context)
        
    except Exception as e:
        logger.error(f"Error in checkout view: {str(e)}")
        return redirect('cart_detail')

@require_POST
@login_required
@transaction.atomic
def process_checkout(request):
    try:
        cart = Cart(request)
        
        if len(cart) == 0:
            return JsonResponse({
                'success': False,
                'message': 'Your cart is empty'
            }, status=400)
        
        # Parse form data
        data = json.loads(request.body)
        logger.info(f"Processing checkout for user: {request.user.username}")
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return JsonResponse({
                'success': False,
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)
        
        # Validate phone number
        phone = data['phone'].strip()
        if not phone.isdigit() or len(phone) != 10:
            return JsonResponse({
                'success': False,
                'message': 'Please enter a valid 10-digit phone number'
            }, status=400)
        
        # Validate pincode
        pincode = data['pincode'].strip()
        if not pincode.isdigit() or len(pincode) != 6:
            return JsonResponse({
                'success': False,
                'message': 'Please enter a valid 6-digit PIN code'
            }, status=400)
        
        # Get shipping charge for selected state
        try:
            shipping_charge_obj = ShippingCharge.objects.get(state_name=data['state'], is_active=True)
            shipping_charge = shipping_charge_obj.shipping_charge
        except ShippingCharge.DoesNotExist:
            shipping_charge = Decimal('0')
        
        # Calculate totals - convert to float for JSON serialization
        subtotal = float(cart.get_subtotal_price())
        discount = float(getattr(cart, 'get_coupon_discount', lambda: Decimal('0'))())
        shipping_charge_float = float(shipping_charge)
        total_amount = subtotal - discount + shipping_charge_float
        
        # Create order - use Decimal for database, float for calculations
        order = Order(
            user=request.user,
            full_name=data['full_name'].strip(),
            email=data['email'].strip().lower(),
            phone=phone,
            alt_phone=data.get('alt_phone', '').strip(),
            address=data['address'].strip(),
            city=data['city'].strip(),
            state=data['state'],
            pincode=pincode,
            landmark=data.get('landmark', '').strip(),
            subtotal=Decimal(str(subtotal)),  # Convert back to Decimal for DB
            shipping_charge=shipping_charge,
            discount=Decimal(str(discount)),  # Convert back to Decimal for DB
            total_amount=Decimal(str(total_amount)),  # Convert back to Decimal for DB
            payment_method='cod',
            payment_status='pending',
            status='pending'
        )
        order.save()
        
        # Create order items
        for item in cart:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price']  # This should already be Decimal from the model
            )
        
        # Create payment record for 50% advance
        advance_amount = Decimal(str(total_amount)) * Decimal('0.5')
        payment = Payment.objects.create(
            order=order,
            payment_id=f"PAY_{order.order_number}",
            amount=advance_amount,
            payment_method='upi',
            status='pending',
            transaction_id=''
        )
        
        # Generate QR code data
        qr_data = generate_upi_qr_data(float(advance_amount), order.order_number)
        
        # Clear cart - THIS IS THE KEY FIX!
        # Remove the cart from session BEFORE returning JSON response
        cart_key = settings.CART_SESSION_ID
        if cart_key in request.session:
            del request.session[cart_key]
        
        # Also clear coupon if exists
        if 'coupon_id' in request.session:
            del request.session['coupon_id']
        
        # Force session save to avoid Decimal serialization issues
        request.session.modified = True
        
        logger.info(f"Order created successfully: {order.order_number}")
        
        return JsonResponse({
            'success': True,
            'order_number': order.order_number,
            'tracking_id': str(order.tracking_id),
            'advance_amount': float(advance_amount),  # Use float for JSON
            'remaining_amount': float(Decimal(str(total_amount)) - advance_amount),
            'total_amount': total_amount,  # This is already float
            'qr_data': qr_data,
            'payment_id': payment.payment_id
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        logger.error(f"Error processing checkout: {str(e)}", exc_info=True)
        return JsonResponse({
            'success': False,
            'message': 'Unable to process your order. Please try again.'
        }, status=500)

def generate_upi_qr_data(amount, order_number):
    """Generate UPI QR code payment URL"""
    # IMPORTANT: Replace with your actual UPI details
    upi_id = "sahilraghav2004@ybl"  # Use your actual UPI ID
    merchant_name = "SahilStore"  # Replace with your store/business name
    transaction_note = f"Advance payment for order {order_number}"
    
    # UPI URL format for QR codes
    upi_url = (f"upi://pay?pa={upi_id}&pn={merchant_name}"
               f"&am={amount:.2f}&tn={transaction_note}&cu=INR")
    return upi_url


@require_POST
@login_required
@transaction.atomic
def submit_utr(request):
    """Handle UTR submission for payment verification"""
    try:
        data = json.loads(request.body)
        order_number = data.get('order_number')
        utr_number = data.get('utr_number', '').strip()
        
        print(f"UTR Submission - Order: {order_number}, UTR: {utr_number}")  # Debug log
        
        if not order_number or not utr_number:
            return JsonResponse({
                'success': False,
                'message': 'Order number and UTR number are required'
            }, status=400)
        
        if len(utr_number) < 10:
            return JsonResponse({
                'success': False,
                'message': 'Please enter a valid UTR number (minimum 10 characters)'
            }, status=400)
        
        # Get the order
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
            print(f"Order found: {order.order_number}")  # Debug log
        except Order.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Order not found'
            }, status=404)
        
        # Update payment record - get the specific payment for this order
        try:
            payment = Payment.objects.get(order=order, payment_method='upi')
            print(f"Payment found: {payment.payment_id}, Current transaction_id: {payment.transaction_id}")  # Debug log
        except Payment.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'No UPI payment found for this order'
            }, status=404)
        
        # Update the payment with UTR
        payment.transaction_id = utr_number
        payment.payment_details = {
            'utr_number': utr_number,
            'submitted_at': timezone.now().isoformat(),
            'verified': False,
            'payment_method': 'upi'
        }
        payment.status = 'submitted'
        payment.save()
        
        print(f"Payment updated - Transaction ID: {payment.transaction_id}")  # Debug log
        
        # Update order status
        order.payment_status = 'submitted'
        order.save()
        
        logger.info(f"UTR submitted for order: {order_number}, UTR: {utr_number}")
        
        return JsonResponse({
            'success': True,
            'message': 'Payment proof submitted successfully! Your order will be confirmed after verification.',
            'order_number': order.order_number,
            'utr_number': utr_number
        })
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")  # Debug log
        return JsonResponse({
            'success': False,
            'message': 'Invalid data format'
        }, status=400)
    except Exception as e:
        print(f"UTR Submission Error: {e}")  # Debug log
        logger.error(f"Error submitting UTR: {str(e)}", exc_info=True)
        return JsonResponse({
            'success': False,
            'message': 'Error submitting payment proof. Please try again.'
        }, status=500)


@require_POST
def get_shipping_charge(request):
    """Get shipping charge for selected state"""
    try:
        state = request.POST.get('state', '').strip()
        if not state:
            return JsonResponse({
                'success': False,
                'message': 'State is required'
            }, status=400)
        
        shipping_charge = ShippingCharge.objects.filter(
            state_name=state, 
            is_active=True
        ).first()
        
        if shipping_charge:
            return JsonResponse({
                'success': True,
                'shipping_charge': float(shipping_charge.shipping_charge)
            })
        else:
            return JsonResponse({
                'success': True,
                'shipping_charge': 0.0
            })
            
    except Exception as e:
        logger.error(f"Error getting shipping charge: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': 'Error fetching shipping charge'
        }, status=500)


@login_required
def order_confirmation(request, order_number):
    order = get_object_or_404(Order, order_number=order_number, user=request.user)
    
    # Get the payment details for display
    try:
        payment = Payment.objects.get(order=order, payment_method='upi')
    except Payment.DoesNotExist:
        payment = None
    
    context = {
        'order': order,
        'payment': payment
    }
    return render(request, 'order_confirmation.html', context)


@login_required
def track_order(request, tracking_id):
    order = get_object_or_404(Order, tracking_id=tracking_id)
    
    # Check if user owns the order or is staff
    if order.user != request.user and not request.user.is_staff:
        return redirect('home')
    
    return render(request, 'track_order.html', {'order': order})
def about(request):
    cart=Cart(request)
    cart_count=len(cart)
    return render(request,"About.html",{'cart_count':cart_count})