import React from 'react'
import "../styles/Checkoutpage.css";
function CheckoutPage() {
    return (
        <>
            <div className='main_checkout'>

                <section className='background_left'>
                    <div className='main_grid'>

                        <div className='main_deptcription'>
                            <h1>Proceed to Payment.</h1>
                            <p>
                                A simple and responsive payment checkout experience
                                designed for modern applications.
                            </p>

                        </div>

                        <div className='main_payment'>
                            <h2>Payment</h2>
                            <hr class="separator" />
                            <div className="payment_methods">
                                <label className='radio_item'>
                                    <input className='payment_input' type="radio" name="pay" defaultChecked />
                                    <span>Card</span>
                                </label>
                                <label className='radio_item' >
                                    <input className='payment_input' type="radio" name="pay" />
                                    <span>Bank</span>
                                </label>
                                <label className='radio_item'>
                                    <input className='payment_input' type="radio" name="pay" />
                                    <span>Transfer</span>
                                </label>
                            </div>


                            <div className='flex_check'>
                                <input type="text" placeholder="Card Number" />

                                <div className="payment_row">
                                    <input type="text" placeholder="MM/YY" />
                                    <input type="text" placeholder="CVV" />

                                </div>
                            </div>
                            <input type="text" placeholder="Card Number" />

                            <div className="payment_row">
                                <input type="text" placeholder="MM/YY" />
                                <input type="text" placeholder="CVV" />

                            </div>


                            {/* <div className='check_box'>
                                <input type="checkbox" />
                                <span>Save card deltai</span>
                            </div> */}

                            <button className="btn_pay">Pay</button>

                            <span className='text_span'>
                                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy
                            </span>



                        </div>

                    </div>
                </section>

            </div>
        </>
    )
}

export default CheckoutPage
