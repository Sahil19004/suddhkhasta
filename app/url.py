from django.contrib import admin
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
urlpatterns = [
path('admin/', admin.site.urls),
path('',views.indexpage,name='indexpage'),
path('product-detail/<int:myid>',views.product_detail,name='product_detail'),
path('login/',views.login,name='login'),
path('about/',views.about,name='about'),
path('signup/',views.signup,name='signup'),
path('logout/',views.logout,name='logout'),
path('cart/', views.cart_detail, name='cart_detail'),
path('cart/add/<int:product_id>/', views.cart_add, name='cart_add'),
path('cart/remove/<int:product_id>/', views.cart_remove, name='cart_remove'),
path('cart/update/<int:product_id>/', views.cart_update, name='cart_update'),
path('cart/apply-coupon/', views.cart_apply_coupon, name='apply_coupon'),
path('cart/remove-coupon/', views.cart_remove_coupon, name='remove_coupon'),
path('contact/',views.contact,name='contact'),
path('terms/',views.terms,name='terms'),
path('checkout/', views.checkout, name='checkout'),
path('checkout/process/', views.process_checkout, name='process_checkout'),
path('checkout/submit-utr/', views.submit_utr, name='submit_utr'),
path('checkout/shipping-charge/', views.get_shipping_charge, name='get_shipping_charge'),
path('order/confirmation/<str:order_number>/', views.order_confirmation, name='order_confirmation'),
path('order/track/<uuid:tracking_id>/', views.track_order, name='track_order'),
path('shipping-policy/',views.shippingpol,name='shippingpol'),
path('cart/debug/', views.cart_debug, name='cart_debug'),
path('order-page/', views.orderpage, name='orderpage'),

 # Add this new URL for review submission
    path('product-detail/<int:myid>/submit-review/', views.submit_review, name='submit_review'),
]