'use client';

import { useEffect, useState } from 'react';

export default function StaffHome() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  const staffid = typeof window !== 'undefined' ? localStorage.getItem('staffid') : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/staffhome?staffid=${staffid}`);
        const data = await res.json();
        setActiveRequests(data.active || []);
        setAcceptedRequests(data.accepted || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    if (staffid) fetchData();
  }, [staffid]);

  const handlePickRequest = async (requestId) => {
    try {
      const res = await fetch('/api/staffhome', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestid: requestId, staffid }),
      });

      if (res.ok) {
        const updatedRequest = activeRequests.find((r) => r.requestid === requestId);
        setActiveRequests((prev) => prev.filter((r) => r.requestid !== requestId));
        setAcceptedRequests((prev) => [...prev, { ...updatedRequest, status: 'pending' }]);
      }
    } catch (error) {
      console.error('Failed to pick request:', error);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const res = await fetch('/api/staffhome', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestid: requestId }),
      });

      if (res.ok) {
        setAcceptedRequests((prev) =>
          prev.filter((r) => r.requestid !== requestId)
        );
      }
    } catch (error) {
      console.error('Failed to complete request:', error);
    }
  };

  const requestsToShow = tab === 'active' ? activeRequests : acceptedRequests;

  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
        Animal Rescue Requests
      </h1>

      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-l-lg ${tab === 'active' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          onClick={() => setTab('active')}
        >
          Active
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg ${tab === 'accepted' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          onClick={() => setTab('accepted')}
        >
          Accepted
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {requestsToShow.map((req) => (
          <div
            key={req.requestid}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col"
          >
            <img
              src={req.imageurl}
              alt={req.name}
              className="w-full h-[500px] object-cover rounded-md mb-4"
            />
            <div className="flex flex-col gap-2 mb-4">
              <p><strong>Name:</strong> {req.name}</p>
              <p><strong>Breed:</strong> {req.breed}</p>
              <p><strong>Species:</strong> {req.species}</p>
              <p><strong>Description:</strong> {req.requestbody}</p>
              <p><strong>Location:</strong> {req.location}</p>
            </div>

            {tab === 'active' && (
              <button
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => handlePickRequest(req.requestid)}
              >
                Pick Request
              </button>
            )}

            {tab === 'accepted' && req.status === 'pending' && (
              <button
                className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={() => handleCompleteRequest(req.requestid)}
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
