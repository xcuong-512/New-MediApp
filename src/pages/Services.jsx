
import React from 'react'
import "../styles/Services.css";
function Services() {
    return (
        <>
            <div className='main_medical'>

                <div className='medical_context'>
                    <h2 className='context_high1'>MediConnect's Featured Services</h2>
                    <p className='medical_p'>
                        Trust is our core value. MediConnect simplifies complex insurance terms, ensuring you receive

                        full reimbursement for medical expenses as promised. Our partnership with major insurers like
                        UIC reflects our standing as a top-tier healthcare service integrator. Through our comprehensive suite of
                        services—including 24/7 claims support, strategic medical network coordination, and personalized insurance consultancy—we bridge the gap between policy
                        terms and actual patient care, making high-quality healthcare more accessible and transparent for everyone.
                    </p>

                    <p className='medical_note'>Below are the highlighted services frequently chosen by our users:</p>

                    <a class="medical_link" href="#">Doctor Booking</a>
                    <a class="medical_link" href="#">Quick Doctor Search</a>
                </div>

                <div className='medical_image'>
                    <img className='image_doctor' src="https://uic.vn/wp-content/uploads/2022/03/logo_fb.webp" alt="" />
                </div>
            </div>

            <section className='product-feature'>
                <h2 class="product-features__title">Featured Services</h2>
                <div className='feature_grid'>
                    <div className='feature_card'>
                        <img className='feature_icon' src="https://cdn-icons-png.flaticon.com/512/2002/2002576.png" alt="" />
                        <div className='test_feature'>
                            <div class="number-circle">1</div>
                            <p class="feature-card__text">
                                Choose your doctor, pick a time, book quickly.
                            </p>
                        </div>

                    </div>

                    <div className='feature_card'>
                        <img className='feature_icon' src=" https://cdn-icons-png.flaticon.com/512/2693/2693710.png" alt="" />
                        <div className='test_feature'>
                            <div class="number-circle">2</div>
                            <p class="feature-card__text">
                                Manage Appointments. Schedule Quickly & Easily.
                            </p>
                        </div>

                    </div>

                    <div className='feature_card'>
                        <img className='feature_icon' src="https://cdn-icons-png.flaticon.com/512/10464/10464776.png" alt="" />
                        <div className='test_feature'>
                            <div class="number-circle">3</div>
                            <p class="feature-card__text">
                                Encrypted Login – Protecting Your Privacy.
                            </p>
                        </div>

                    </div>
                </div>

            </section>


            <section class="consult-section">
                <div class="consult-container">


                    <div class="consult-content">
                        <h2 class="consult-title">
                            Need medical advice regarding our services?
                        </h2>

                        <form class="consult-form">
                            <div class="form-group">
                                <input type="text" placeholder="Name" required />
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <input type="tel" placeholder="Number *" required />
                                </div>

                                <div class="form-group">
                                    <input type="email" placeholder="Email" />
                                </div>
                            </div>

                            <div class="form-group">
                                <textarea placeholder="Content" rows="5"></textarea>
                            </div>

                            <button type="submit" class="btn-submit">
                                Send Infor
                            </button>
                        </form>
                    </div>


                    <div class="consult-image">
                        <img
                            src="https://uic.vn/wp-content/uploads/2022/03/contact-us-Mod-3.jpg"
                            alt="Contact consultation"
                        />
                    </div>

                </div>
            </section>




        </>
    )
}

export default Services

