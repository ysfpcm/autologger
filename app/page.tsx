'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { formatCallDate } from './call-date'
import { createDailyGenerationLimit, DAILY_GENERATION_LIMIT, GENERATION_STORAGE_KEY } from './daily-generation-limit'

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
    actionTaken: 'VERIFIED CREDENTIALS. RESET MERCHANT GATEWAY CONNECTION. TESTED TRANSACTION FLOW. CONFIRMED SUCCESSFUL INTEGRATION.'
  },
  {
    issue: 'CUSTOMER REPORTED CHARGEBACK DISPUTE PROCESS INQUIRY',
    actionTaken: 'EXPLAINED CHARGEBACK TIMELINE. ASSISTED WITH DOCUMENTATION REQUIREMENTS. UPLOADED TRANSACTION EVIDENCE. SET FOLLOW-UP FOR DISPUTE STATUS.'
  }
];

const CALL_TYPES = [
  { label: 'Tech Call', value: 'techCall' },
  { label: 'Customer Service Call', value: 'customerServiceCall' },
  { label: 'Risk Management', value: 'riskManagement' },
  { label: 'Call From ISO/Agent', value: 'callFromISOAgent' }
];

const CALL_DETAILS = [
  { label: 'Email Call? Yes Or No:', value: 'Yes' },
  { label: 'Call Status:', value: 'New' },
  { label: 'Call Date/Time:', value: '' },
  { label: 'Person Calling:', value: 'John Doe' },
  { label: 'Contact Email Address For Follow Up:', value: 'john.doe@example.com' },
  { label: 'Phone Back To Merchant For Follow-Up:', value: '123-456-7890' },
  { label: 'Call Topic:', value: 'Technical Support Call' },
  { label: 'CHECK TO ADD TASK FOR RETURN CALL/FOLLOW UP:', value: '' }
];

const CALL_DATE_INDEX = 2;

type SavedCallLog = {
  callType: string;
  details: { label: string; value: string }[];
  issue: string;
  actionTaken: string;
};

export default function Component() {
  const [callLog, setCallLog] = useState({
    issue: '',
    actionTaken: ''
  })
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTimer, setGenerationTimer] = useState(7);
  const [generationsLeft, setGenerationsLeft] = useState(DAILY_GENERATION_LIMIT);
  const [isLimitReady, setIsLimitReady] = useState(false);
  const [warning, setWarning] = useState<'limit' | 'generated' | null>(null);
  const [hasGeneratedCurrentLog, setHasGeneratedCurrentLog] = useState(false);
  const [savedLogs, setSavedLogs] = useState<SavedCallLog[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [callDate, setCallDate] = useState('');
  const generationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationLimit = useRef(createDailyGenerationLimit(null));
  useEffect(() => {
    setCallDate(formatCallDate());
  }, []);

  useEffect(() => {
    try {
      generationLimit.current = createDailyGenerationLimit(window.localStorage);
    } catch {
      generationLimit.current = createDailyGenerationLimit(null);
    }

    const refreshLimit = () => {
      const remaining = generationLimit.current.remaining();
      setGenerationsLeft(remaining);
      if (remaining > 0) {
        setWarning((current) => current === 'limit' ? null : current);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === GENERATION_STORAGE_KEY || event.key === null) refreshLimit();
    };
    refreshLimit();
    setIsLimitReady(true);
    const refreshInterval = setInterval(refreshLimit, 60000);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refreshLimit);
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refreshLimit);
    };
  }, []);

  useEffect(() => () => {
    if (generationInterval.current !== null) {
      clearInterval(generationInterval.current);
    }
    if (warningTimeout.current !== null) {
      clearTimeout(warningTimeout.current);
    }
  }, []);

  const showTemporaryWarning = (reason: 'limit' | 'generated') => {
    if (warningTimeout.current !== null) {
      clearTimeout(warningTimeout.current);
    }
    setWarning(reason);
    warningTimeout.current = setTimeout(() => {
      setWarning(null);
      warningTimeout.current = null;
    }, 3000);
  };

  const updateCallLog = (updatedLog: typeof callLog) => {
    setCallLog(updatedLog);
    if (updatedLog.issue.trim() || updatedLog.actionTaken.trim()) {
      setSubmissionError(null);
    }
  };

  const generateCallLog = () => {
    if (!isLimitReady || generationInterval.current !== null) {
      return;
    }

    // Check both conditions: generations left and if current log already has generation
    const remaining = generationLimit.current.remaining();
    setGenerationsLeft(remaining);
    if (remaining <= 0) {
      showTemporaryWarning('limit');
      return;
    }

    if (hasGeneratedCurrentLog) {
      // Show a different warning for attempting to regenerate same call log
      showTemporaryWarning('generated');
      return;
    }

    if ((callLog.issue || callLog.actionTaken) &&
        !window.confirm('Generating a call log will replace the existing issue and resolution. Continue?')) {
      return;
    }

    setIsGenerating(true);
    let secondsRemaining = 7;
    generationInterval.current = setInterval(() => {
      secondsRemaining -= 1;
      if (secondsRemaining === 0) {
        if (generationInterval.current !== null) {
          clearInterval(generationInterval.current);
          generationInterval.current = null;
        }
        setIsGenerating(false);
        setGenerationTimer(7);
        const remaining = generationLimit.current.consume();
        if (remaining === null) {
          setGenerationsLeft(0);
          showTemporaryWarning('limit');
          return;
        }
        const randomIndex = Math.floor(Math.random() * MOCK_CALL_LOGS.length);
        updateCallLog(MOCK_CALL_LOGS[randomIndex]);
        setGenerationsLeft(remaining);
        setHasGeneratedCurrentLog(true);
      } else {
        setGenerationTimer(secondsRemaining);
      }
    }, 1000);
  };

  const resetCallLog = () => {
    setCallDate(formatCallDate());
    if (generationInterval.current !== null) {
      clearInterval(generationInterval.current);
      generationInterval.current = null;
    }
    setIsGenerating(false);
    setGenerationTimer(7);
    setCallLog({ issue: '', actionTaken: '' });
    setHasGeneratedCurrentLog(false);
    setSubmissionError(null);
  };

  const addCallLog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isGenerating) return;
    if (!callLog.issue.trim() && !callLog.actionTaken.trim()) {
      setSubmissionError('Enter an issue or resolution before adding a call log.');
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const callType = CALL_TYPES.find((type) => type.value === data.get('callType'))?.label ?? '';
    const details = CALL_DETAILS.map((detail, index) => ({
      label: detail.label,
      value: String(data.get(`detail-${index}`) ?? '')
    }));
    setSavedLogs((current) => [...current, { callType, details, ...callLog }]);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-1 m-4 bg-white shadow-md flex flex-col">
        <header className="bg-blue-600 text-white p-3 lg:p-4">
          <h1 className="text-xl lg:text-2xl font-semibold">Electronic Payments (EPI) - View Call</h1>
        </header>
        
        <form className="flex-1 p-3 lg:p-6" onReset={resetCallLog} onSubmit={addCallLog}>
          <div className="mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold mb-2 text-gray-900">Merchant Info</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-900">53096111000000000</p>
              <p className="text-gray-900">JOHN DOE</p>
              <p className="text-gray-900">123 MAIN STREET</p>
              <p className="text-gray-900">ANYTOWN, NY 12345</p>
              <p className="text-gray-900">(555) 123-4567</p>
            </div>
          </div>

          <div className="bg-yellow-100 p-2 mb-4 lg:mb-6 flex space-x-4">
            {CALL_TYPES.map((type, index) => (
              <label key={type.value} className="inline-flex items-center text-gray-900">
                <input type="radio" name="callType" value={type.value} className="form-radio text-blue-600" defaultChecked={index === 0} />
                <span className="ml-2">{type.label}</span>
              </label>
            ))}
          </div>

          <div className="mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold mb-2 text-gray-900">Details Submitted...</h2>
            <div className="space-y-0.5">
              {CALL_DETAILS.map((field, index) => (
                <div key={index} className="flex">
                  <div className="w-1/2 bg-gray-100 p-2">
                    <label htmlFor={`detail-${index}`} className="text-gray-900 font-medium">{field.label}</label>
                  </div>
                  <div className="w-1/2">
                    <input 
                      id={`detail-${index}`}
                      name={`detail-${index}`}
                      value={index === CALL_DATE_INDEX ? callDate : undefined}
                      onChange={index === CALL_DATE_INDEX ? (event) => setCallDate(event.target.value) : undefined}
                      defaultValue={index === CALL_DATE_INDEX ? undefined : field.value}
                      className="w-full p-2 border text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4 relative">
            {warning && (
              <div role="alert" className="text-red-600 mb-2">
                {warning === 'limit'
                  ? "You have reached the maximum number of generations for today."
                  : "You have already generated content for this call log. Please submit or clear the form to generate a new one."}
              </div>
            )}
            {submissionError && <div role="alert" className="text-red-600 mb-2">{submissionError}</div>}
            <div className="text-gray-600 mb-2">
              Generations remaining today: {generationsLeft}
            </div>
            <div role="status" className="text-gray-600 mb-2">
              Added call logs: {savedLogs.length}. Logs are available only until this page is reloaded or closed.
            </div>
            {isGenerating && (
              <div role="status" className="text-gray-600 mb-2">
                Editing is paused while the call log is generated.
              </div>
            )}
            <div className="relative">
              <label htmlFor="call-issue" className="block text-sm font-medium text-gray-900 mb-1">
                Call Issue/Problem/Overall Subject
              </label>
              <textarea
                id="call-issue"
                value={callLog.issue}
                onChange={(e) => updateCallLog({ ...callLog, issue: e.target.value })}
                readOnly={isGenerating}
                className="w-full h-32 p-2 border rounded text-gray-900 bg-white read-only:bg-gray-100"
              />
              <div className="absolute top-[-1.2rem] right-0 flex space-x-2 mr-1">
                <motion.div
                  whileHover={{ scale: isGenerating ? 1 : 1.05 }}
                  whileTap={{ scale: isGenerating ? 1 : 0.95 }}
                >
                  <button 
                    type="button"
                    onClick={generateCallLog} 
                    disabled={!isLimitReady || isGenerating || hasGeneratedCurrentLog}
                    className={`
                      px-4 py-2 rounded
                      ${(!isLimitReady || isGenerating || hasGeneratedCurrentLog)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                      }
                      text-white
                    `}
                    title={
                      !isLimitReady
                        ? "Loading generation limit..."
                        : isGenerating
                          ? "Generation in progress..."
                          : hasGeneratedCurrentLog
                            ? "Already generated for this call log"
                            : "Select to summarize call"
                    }
                  >
                    {isGenerating 
                      ? `GENERATING... (${generationTimer}s)` 
                      : hasGeneratedCurrentLog 
                        ? 'ALREADY GENERATED'
                        : 'GENERATE CALL LOG'
                    }
                  </button>
                </motion.div>
                <button 
                  type="reset"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Clear Form
                </button>
                <button type="submit" disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded">
                  Add Call Log
                </button>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="call-resolution" className="block text-sm font-medium text-gray-900 mb-1">
                Actions Taken/Resolution To Issue
              </label>
              <textarea
                id="call-resolution"
                value={callLog.actionTaken}
                onChange={(e) => updateCallLog({ ...callLog, actionTaken: e.target.value })}
                readOnly={isGenerating}
                className="w-full h-32 p-2 border rounded text-gray-900 bg-white read-only:bg-gray-100"
              />
            </div>
          </div>
        </form>
        {savedLogs.length > 0 && (
          <section className="p-3 lg:p-6 text-gray-900" aria-labelledby="saved-call-logs">
            <h2 id="saved-call-logs" className="text-lg font-bold">Added Call Logs</h2>
            <p>These call logs are available only until this page is reloaded or closed.</p>
            {savedLogs.map((log, index) => (
              <article key={index} className="mt-4 border rounded p-4">
                <h3 className="font-semibold">Call Log {index + 1}: {log.callType}</h3>
                <dl className="mt-2">
                  {log.details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="inline font-medium">{detail.label} </dt>
                      <dd className="inline">{detail.value || '—'}</dd>
                    </div>
                  ))}
                  <dt className="font-medium mt-2">Issue</dt>
                  <dd className="whitespace-pre-wrap">{log.issue || '—'}</dd>
                  <dt className="font-medium mt-2">Actions Taken</dt>
                  <dd className="whitespace-pre-wrap">{log.actionTaken || '—'}</dd>
                </dl>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
