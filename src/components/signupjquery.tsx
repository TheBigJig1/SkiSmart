import '@/styles/routes/signin.css';
{/*import skiMountains from '../assets/skiMountains.jpg';
import logo from '../assets/logoCircle.png';*/}
import $ from 'jquery';
import { useEffect } from 'react';

function Signup() {
    useEffect(() => {
        // Place your jQuery code here
       

        $('.submit-button').on('click', function() {
            //get input from the fields and create accounts if requirements are correct
        });
        
        

        return () => {
            // Clean up event listeners if needed
            $('#email').off('focus blur');
        };
    }, []);}