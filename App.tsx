import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contracts from './pages/Contracts';
import WhatsappConnect from './pages/WhatsappConnect';

const App: React.FC = () => {
	return (
		<Router>
			<div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
				<Navbar />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/contratos" element={<Contracts />} />
						<Route path="/whatsapp" element={<WhatsappConnect />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
