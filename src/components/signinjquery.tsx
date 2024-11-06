import '@/styles/routes/signin.css';
{/*import skiMountains from '../assets/skiMountains.jpg';
import logo from '../assets/logoCircle.png';*/}
import $ from 'jquery';
import { useEffect } from 'react';


function Signin() {
    useEffect(() => {
        // Handle form submission
        $('.submit-button').on('click', function(e) {
            e.preventDefault();
            
            // Get input values
            const email = $('#email').val() as string;
            const password = $('#password').val() as string;

            // Basic validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // TODO: Add authentication logic here
            console.log('Login attempt with:', {email, password});
        });

        // Helper function to validate email format
        function isValidEmail(email: string) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Add input field handlers
        $('#email, #password').on('focus', function() {
            $(this).addClass('focused');
        });

        $('#email, #password').on('blur', function() {
            $(this).removeClass('focused');
        });

        return () => {
            // Clean up event listeners
            $('.submit-button').off('click');
            $('#email, #password').off('focus blur');
        };
    }, []);
}