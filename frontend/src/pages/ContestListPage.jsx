// src/pages/ContestListPage.jsx
import React, { useState } from 'react';
import ContestList from '../components/contests/ContestList';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContestListPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white ">
      <Header />
      <div className="container mx-auto px-4 py-5 mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Coding Contests</h1>
              <p className="text-gray-400 mt-2">
                Test your skills against other developers in timed competitions
              </p>
            </div>
            
          </div>
          
          <ContestList 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </motion.div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ContestListPage;