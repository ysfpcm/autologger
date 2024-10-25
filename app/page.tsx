'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const MOCK_CALL_LOGS = [
  {
    issue: 'CUSTOMER UNABLE TO PROCESS REFUND ON TERMINAL - ERROR CODE 506',
    actionTaken: 'WALKED CUSTOMER THROUGH REFUND MENU. VERIFIED MERCHANT CREDENTIALS AND SUCCESSFULLY PROCESSED REFUND. PROVIDED REFERENCE NUMBER.'
  },
  {
    issue: 'BATCH SETTLEMENT FAILURE - TERMINAL DISPLAYING COMMUNICATION ERROR',
    actionTaken: 'CONFIRMED NETWORK CONNECTION. INITIATED FORCED SETTLEMENT. VERIFIED BATCH CLOSED SUCCESSFULLY. ADVISED ON PROPER CLOSING PROCEDURES.'
  },
  {
    issue: 'CUSTOMER REPORTING DUPLICATE CHARGES ON POS SYSTEM',
    actionTaken: 'REVIEWED TRANSACTION HISTORY. IDENTIFIED SYSTEM LAG CAUSING DOUBLE POSTING. INITIATED VOID FOR DUPLICATE TRANSACTIONS. RECOMMENDED SYSTEM RESTART.'
  },
  {
    issue: 'TERMINAL SHOWING CARD READ ERROR ON ALL TRANSACTIONS',
    actionTaken: 'GUIDED THROUGH TERMINAL CLEANING PROCEDURE. PERFORMED REMOTE DIAGNOSTIC. CONFIRMED HARDWARE ISSUE. SCHEDULED REPLACEMENT TERMINAL DELIVERY.'
  },
  {
    issue: 'MERCHANT REQUESTING TRAINING ON VIRTUAL TERMINAL ACCESS',
    actionTaken: 'PROVIDED LOGIN CREDENTIALS. DEMONSTRATED VIRTUAL TERMINAL NAVIGATION. EXPLAINED REPORTING FEATURES AND TRANSACTION SEARCH. SENT FOLLOW-UP DOCUMENTATION.'
  },
  {
    issue: 'POS INTEGRATION NOT CONNECTING TO PAYMENT GATEWAY',
    actionTaken: 'VERIFIED API CREDENTIALS. RESET MERCHANT GATEWAY CONNECTION. TESTED TRANSACTION FLOW. CONFIRMED SUCCESSFUL INTEGRATION.'
  },
  {
    issue: 'CUSTOMER REPORTED CHARGEBACK DISPUTE PROCESS INQUIRY',
    actionTaken: 'EXPLAINED CHARGEBACK TIMELINE. ASSISTED WITH DOCUMENTATION REQUIREMENTS. UPLOADED TRANSACTION EVIDENCE. SET FOLLOW-UP FOR DISPUTE STATUS.'
  }
];

export default function Component() {
  const [callLog, setCallLog] = useState({
    issue: '',
    actionTaken: ''
  })
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTimer, setGenerationTimer] = useState(7);
  const [generationsLeft, setGenerationsLeft] = useState(7);
  const [showWarning, setShowWarning] = useState(false);

  const generateCallLog = () => {
    if (generationsLeft <= 0) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    setIsGenerating(true);
    const timer = setInterval(() => {
      setGenerationTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGenerating(false);
          setGenerationTimer(7);
          const randomIndex = Math.floor(Math.random() * MOCK_CALL_LOGS.length);
          setCallLog(MOCK_CALL_LOGS[randomIndex]);
          setGenerationsLeft(prev => prev - 1);
          return 7;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-1 m-4 bg-white shadow-md flex flex-col">
        <header className="bg-blue-600 text-white p-3 lg:p-4">
          <h1 className="text-xl lg:text-2xl font-semibold">Electronic Payments (EPI) - View Call</h1>
        </header>
        
        <div className="flex-1 p-3 lg:p-6">
          <div className="mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold mb-2 text-gray-900">Merchant Info</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-900">5309612620099668</p>
              <p className="text-gray-900">JOHN DOE</p>
              <p className="text-gray-900">123 MAIN STREET</p>
              <p className="text-gray-900">ANYTOWN, NY 12345</p>
              <p className="text-gray-900">(555) 123-4567</p>
            </div>
          </div>

          <div className="bg-yellow-100 p-2 mb-4 lg:mb-6 flex space-x-4">
            <label className="inline-flex items-center text-gray-900">
              <input type="radio" name="callType" value="techCall" className="form-radio text-blue-600" defaultChecked />
              <span className="ml-2">Tech Call</span>
            </label>
            <label className="inline-flex items-center text-gray-900">
              <input type="radio" name="callType" value="customerServiceCall" className="form-radio text-blue-600" />
              <span className="ml-2">Customer Service Call</span>
            </label>
            <label className="inline-flex items-center text-gray-900">
              <input type="radio" name="callType" value="riskManagement" className="form-radio text-blue-600" />
              <span className="ml-2">Risk Management</span>
            </label>
            <label className="inline-flex items-center text-gray-900">
              <input type="radio" name="callType" value="callFromISOAgent" className="form-radio text-blue-600" />
              <span className="ml-2">Call From ISO/Agent</span>
            </label>
          </div>

          <div className="mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold mb-2 text-gray-900">Details Submitted...</h2>
            <div className="space-y-0.5">
              {[
                { label: 'Email Call? Yes Or No:', value: 'Yes' },
                { label: 'Call Status:', value: 'New' },
                { label: 'Call Date/Time:', value: '2024-10-25 3:58:29 PM' },
                { label: 'Person Calling:', value: 'John Doe' },
                { label: 'Contact Email Address For Follow Up:', value: 'john.doe@example.com' },
                { label: 'Phone Back To Merchant For Follow-Up:', value: '123-456-7890' },
                { label: 'Call Topic:', value: 'Technical Support Call' },
                { label: 'CHECK TO ADD TASK FOR RETURN CALL/FOLLOW UP:', value: '' }
              ].map((field, index) => (
                <div key={index} className="flex">
                  <div className="w-1/2 bg-gray-100 p-2">
                    <span className="text-gray-900 font-medium">{field.label}</span>
                  </div>
                  <div className="w-1/2">
                    <input 
                      defaultValue={field.value}
                      className="w-full p-2 border text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4 relative">
            {isGenerating && (
              <div className="text-blue-600 mb-2">
                Please wait while we fetch and summarize your call log ({generationTimer}s)
              </div>
            )}
            {showWarning && (
              <div className="text-red-600 mb-2">
                You have reached the maximum number of generations for today.
              </div>
            )}
            <div className="text-gray-600 mb-2">
              Generations remaining today: {generationsLeft}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Call Issue/Problem/Overall Subject
              </label>
              <textarea
                value={callLog.issue}
                onChange={(e) => setCallLog({ ...callLog, issue: e.target.value })}
                className="w-full h-32 p-2 border rounded text-gray-900 bg-white"
              />
              <div className="absolute top-[-1.2rem] right-0 flex space-x-2 mr-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={generateCallLog} 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    title="Select to summarize call"
                  >
                    GENERATE CALL LOG
                  </button>
                </motion.div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Add Call Log</button>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Actions Taken/Resolution To Issue
              </label>
              <textarea
                value={callLog.actionTaken}
                onChange={(e) => setCallLog({ ...callLog, actionTaken: e.target.value })}
                className="w-full h-32 p-2 border rounded text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
