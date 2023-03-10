import 'react-circular-progressbar/dist/styles.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { store } from './store/store'

const queryClient = new QueryClient()
const root = createRoot(document.querySelector('#root') as HTMLElement)

root.render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <App />
            </Provider>
        </QueryClientProvider>
    </BrowserRouter>
)
