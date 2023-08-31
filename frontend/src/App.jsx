import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TriviaElementsEditor } from './triviaElementsEditor/TriviaElementsEditor';
import { SpotsEditor } from './spotsEditor/SpotsEditor';
import { ReceptionInformation } from './receptionInformation/ReceptionInformation';
import { NavigationBar } from './navigationBar/NavigationBar';
import { SimpleSpotEditor } from './simpleSpotEditor/SimpleSpotEditor';

const queryClient = new QueryClient();

export default function App() {
  return (
    <div data-testid="app" className='bg-white text-black w-screen h-screen'>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className='h-full w-full flex flex-col'>
            <NavigationBar />
            <Routes>
              <Route path="/" element={<ReceptionInformation />} />
              <Route path="/triviaEditor" element={<TriviaElementsEditor />} />
              <Route path="/spotsEditor" element={<SpotsEditor />} />
              <Route path="/simpleSpotEditor" element={<SimpleSpotEditor />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}
