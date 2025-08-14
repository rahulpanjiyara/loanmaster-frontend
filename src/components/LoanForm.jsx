import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'

const LoanForm = () => {
  const [repoRate, setRepoRate] = useState('');
  const [primeSpread, setPrimeSpread] = useState('');
  const [businessStrategy, setBusinessStrategy] = useState('');
  const [riskPremium, setRiskPremium] = useState('');
  const [totalSpread, setTotalSpread] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for backend URL

  const fetchRate = async () => {
    const res = await axios.get(backendUrl+'/loan/get-repo');
    if (res.data) {
      setRepoRate(res.data[0].repoRate);
      setPrimeSpread(res.data[0].primeSpread);
      setBusinessStrategy(res.data[0].businessStrategy);
      setRiskPremium(res.data[0].riskPremium);
      setTotalSpread(res.data[0].totalSpread);
    } else {
      toast.error('Failed to fetch loan settings');
    }
    
  };

  useEffect(() => {
    fetchRate();
  }, []);

  const updateRate = async () => {
    await axios.put(backendUrl+'/loan/set-repo', { repoRate: Number(repoRate),primeSpread: Number(primeSpread), businessStrategy: Number(businessStrategy), riskPremium: Number(riskPremium), totalSpread: Number(totalSpread)});
   toast.success('Rates updated successfully')  ;
  };

  return (
    <div className='flex flex-col gap-2 w-full sm:w-96 p-5 bg-base-100 shadow-lg'>
      <label>Current Repo Rate</label>
      <input type="number" value={repoRate} onChange={e => setRepoRate(e.target.value)} className='input w-full'/>
      <label>Prime Spread</label>
      <input type="number" value={primeSpread} onChange={e => setPrimeSpread(e.target.value)} className='input w-full'/>
      <label>Business Strategy</label>
      <input type="number" value={businessStrategy} onChange={e => setBusinessStrategy(e.target.value)} className='input w-full'/>
      <label>Risk Premium</label>
      <input type="number" value={riskPremium} onChange={e => setRiskPremium(e.target.value)} className='input w-full'/>
      <label>Total Spread</label>
      <input type="number" value={totalSpread} onChange={e => setTotalSpread(e.target.value)} className='input w-full'/>
      <button onClick={updateRate} className='btn btn-neutral btn-outline ms-0.5'>Update</button>
    </div>
  );
};

export default LoanForm;