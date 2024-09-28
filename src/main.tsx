import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('pk_test_51Q3ctpAH0fwEnHmqA4R9A8B9O4ByPp2RPOEmmQk9wkGzZxWRMCm8Ujv85KifNde5iiXJDmR6LD7Bl5MBeRr8VmEP00u6hdE7uN')

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Elements stripe={stripePromise}>
            <App />
        </Elements>
    </BrowserRouter>
)
