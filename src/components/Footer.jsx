import React from 'react'
import '../styles/footer.css';
import {
  FaFacebook,
  FaYoutube,
  FaDiscord,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

function Footer() {
  return (
    <>
      <div className='footer_main'>

        <div className='opening_mediconnect'>
          <h3>MediConnect</h3>
          <p className='infor_text'>
            As the premier healthcare appointment platform in Vietnam, Mediconnect serves as a trusted bridge to the nation's leading medical experts. We are dedicated to crafting a seamless wellness journey, anchored by our compassionate 24/7 premium support
          </p>
          <div className='social_media'>
            <a href="https://facebook.com" target="_blank">
              <FaFacebook size={30} />
            </a>
            <a href="https://youtube.com" target="_blank">
              <FaYoutube size={30} />
            </a>
            <a href="https://discord.com" target="_blank">
              <FaDiscord size={30} />
            </a>

            <a href="https://instagram.com" target="_blank">
              <FaInstagram size={30} />
            </a>


          </div>
        </div>
        <div className='services_footer'>
          <h3>Services</h3>

          <ul>
            <li><a href="#">Book Appointment</a></li>
            <li><a href="#">Manage Appointments</a></li>
            <li><a href="#">Secure Account</a></li>
            <li><a href="#">Auto Slot Scheduling</a></li>
          </ul>

        </div>

        <div className='social_footer'>
          <h3>Contact</h3>
          <p>
            <a href="tel:0123456789">
              <FaPhoneAlt /> 0123 456 789
            </a>
          </p>
          <p><a href="mailto:support@mediconnect.vn">
            <FaEnvelope className='iconer' />  support@mediconnect.vn
          </a></p>
          <p><FaMapMarkerAlt /> 123 Nguyen Van A Street, District 1, Ho Chi Minh City, Vietnam</p>
        </div>

      </div>
      <div className="footer_bottom">
        <p>© 2025 MediConnect. All rights reserved.</p>
      </div>

    </>
  )
}

export default Footer
