# app/management/commands/migrate_carts.py
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.sessions.models import Session
import json

class Command(BaseCommand):
    help = 'Migrate cart data from old structure to new structure'
    
    def handle(self, *args, **options):
        sessions = Session.objects.all()
        migrated_count = 0
        
        for session in sessions:
            session_data = session.get_decoded()
            cart_data = session_data.get(settings.CART_SESSION_ID)
            
            if cart_data and 'items' not in cart_data:
                # This is the old structure, migrate to new structure
                session_data[settings.CART_SESSION_ID] = {
                    'items': cart_data,
                    'coupon': None,
                    'discount': 0
                }
                
                # Update the session
                session.session_data = Session.objects.encode(session_data)
                session.save()
                migrated_count += 1
                
                self.stdout.write(
                    self.style.SUCCESS(f'Migrated session {session.session_key}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully migrated {migrated_count} carts')
        )