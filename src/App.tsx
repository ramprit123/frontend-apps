import { Content } from "./components/Content";
import Header from "./components/Header";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Content />
      </main>
      <footer className="bg-white border-t py-8 mt-16 ">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Fresh Market. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}


