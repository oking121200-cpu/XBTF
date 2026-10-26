import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  TrendingUp, TrendingDown, RefreshCw, Calendar, FileText, 
  User, Lock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight, 
  Search, Shield, DollarSign, BarChart2, PieChart, Users, Settings, Bell, ChevronRight, Check, X, LogOut, LogIn, Wallet, ArrowUp, ArrowDown, Send, Phone, Mail
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'member' | 'admin'
  const [chartPeriod, setChartPeriod] = useState('1m'); 
  const [perfTab, setPerfTab] = useState('daily'); 
  const [showMoreModal, setShowMoreModal] = useState(false); 

  // --- 인증 및 로그인/회원가입 상태 관리 ---
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('xbtf_current_user');
    return saved ? JSON.parse(saved) : null;
  }); 

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('xbtf_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('xbtf_current_user');
    }
  }, [currentUser]);

  // 회원가입 입력 폼 상태
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');

  // 회원 및 입출금 목록 상태 (Supabase 연동)
  const [membersList, setMembersList] = useState([
    { id: 'hong123', name: '홍길동', phone: '010-1234-5678', email: 'hong@example.com', status: '승인완료', role: 'member', balance: 15420000, holdings: 450 },
  ]);

  const [depositRequests, setDepositRequests] = useState([]);

  // Supabase에서 데이터 불러오기 (중복 제거 및 최신 상태 반영)
  const fetchDataFromSupabase = async () => {
    const { data, error } = await supabase
      .from('xbtf')
      .select('*');

    if (error) {
      console.error('데이터 불러오기 오류:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const parsedMembers = [];
      const requestMap = new Map();

      data.forEach(item => {
        try {
          let parsed = item.xbtf;
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          if (parsed) {
            if (parsed.type === 'USDT 예치(입금)' || parsed.type === '출금신청') {
              requestMap.set(parsed.id, parsed);
            } else {
              if (Array.isArray(parsed)) {
                parsedMembers.push(...parsed);
              } else {
                parsedMembers.push(parsed);
              }
            }
          }
        } catch (e) {
          console.error('JSON 파싱 에러:', e);
        }
      });

      setDepositRequests(Array.from(requestMap.values()));

      setMembersList(prev => {
        const map = new Map();
        map.set('hong123', { id: 'hong123', name: '홍길동', phone: '010-1234-5678', email: 'hong@example.com', status: '승인완료', role: 'member', balance: 15420000, holdings: 450 });
        
        parsedMembers.forEach(pm => {
          if (pm && pm.id) {
            map.set(pm.id, {
              id: pm.id,
              name: pm.name || '이름없음',
              phone: pm.phone || '-',
              email: pm.email || '-',
              password: pm.password || '',
              status: pm.status || '대기중',
              role: 'member',
              balance: pm.balance || 0,
              holdings: pm.holdings || 0
            });
          }
        });
        return Array.from(map.values());
      });
    }
  };

  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  // --- 펀드 및 대시보드 상태 관리 ---
  const [currentNav, setCurrentNav] = useState(33521.21);
  const [dailyReturn, setDailyReturn] = useState(4.70);
  const [weeklyReturn, setWeeklyReturn] = useState(17.83);
  const [monthlyReturn, setMonthlyReturn] = useState(68.32); //[cite: 7]
  
  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const chartDataMap = {
    '1m': [
      { date: '09.26', price: 19915 },
      { date: '09.30', price: 22100 },
      { date: '10.07', price: 25800 },
      { date: '10.14', price: 28289 },
      { date: '10.21', price: 29841 },
      { date: '10.26', price: currentNav },
    ],
    '3m': [
      { date: '07.26', price: 15000 },
      { date: '08.15', price: 17500 },
      { date: '09.01', price: 19915 },
      { date: '09.26', price: 19915 },
      { date: '10.14', price: 28289 },
      { date: '10.26', price: currentNav },
    ],
    '6m': [
      { date: '04.26', price: 12000 },
      { date: '06.01', price: 14000 },
      { date: '07.26', price: 15000 },
      { date: '09.01', price: 19915 },
      { date: '10.26', price: currentNav },
    ],
    '1y': [
      { date: '2025.10', price: 9000 },
      { date: '2026.01', price: 11000 },
      { date: '2026.04', price: 12000 },
      { date: '2026.07', price: 15000 },
      { date: '10.26', price: currentNav },
    ]
  };

  // 9월 1일부터 10월 26일까지의 모든 평일(주말 제외) 기준가 및 변동률 내역
  const [historyList, setHistoryList] = useState([
    { date: '2026.10.26', price: 33521.21, change: '+4.70%' },
    { date: '2026.10.23', price: 32029.15, change: '+3.78%' },
    { date: '2026.10.22', price: 30857.13, change: '+3.41%' },
    { date: '2026.10.21', price: 29841.27, change: '+2.95%' },
    { date: '2026.10.20', price: 28991.45, change: '+3.12%' },
    { date: '2026.10.19', price: 28111.32, change: '+2.48%' },
    { date: '2026.10.16', price: 27430.00, change: '-0.85%' },
    { date: '2026.10.15', price: 27665.00, change: '+1.90%' },
    { date: '2026.10.14', price: 27148.00, change: '+2.10%' },
    { date: '2026.10.13', price: 26590.00, change: '+1.45%' },
    { date: '2026.10.12', price: 26210.00, change: '-1.10%' },
    { date: '2026.10.08', price: 26500.00, change: '+2.20%' },
    { date: '2026.10.07', price: 25930.00, change: '-0.75%' },
    { date: '2026.10.06', price: 26125.00, change: '+3.10%' },
    { date: '2026.10.05', price: 25340.00, change: '+1.80%' },
    { date: '2026.10.02', price: 24890.00, change: '+1.65%' },
    { date: '2026.10.01', price: 24486.00, change: '-0.90%' },
    { date: '2026.09.30', price: 24708.00, change: '+2.05%' },
    { date: '2026.09.29', price: 24212.00, change: '+1.50%' },
    { date: '2026.09.28', price: 23854.00, change: '-1.20%' },
    { date: '2026.09.25', price: 24144.00, change: '+1.75%' },
    { date: '2026.09.24', price: 23729.00, change: '+2.10%' },
    { date: '2026.09.23', price: 23241.00, change: '+1.30%' },
    { date: '2026.09.22', price: 22942.00, change: '-0.65%' },
    { date: '2026.09.21', price: 23092.00, change: '+2.20%' },
    { date: '2026.09.18', price: 22594.00, change: '+1.90%' },
    { date: '2026.09.17', price: 22173.00, change: '+1.45%' },
    { date: '2026.09.16', price: 21856.00, change: '-1.10%' },
    { date: '2026.09.15', price: 22099.00, change: '+2.15%' },
    { date: '2026.09.14', price: 21634.00, change: '+1.80%' },
    { date: '2026.09.11', price: 21251.00, change: '+1.20%' },
    { date: '2026.09.10', price: 20999.00, change: '-0.80%' },
    { date: '2026.09.09', price: 21168.00, change: '+2.05%' },
    { date: '2026.09.08', price: 20743.00, change: '+1.60%' },
    { date: '2026.09.07', price: 20416.00, change: '+1.35%' },
    { date: '2026.09.04', price: 20144.00, change: '-0.50%' },
    { date: '2026.09.03', price: 20245.00, change: '+1.80%' },
    { date: '2026.09.02', price: 19887.00, change: '-0.40%' },
    { date: '2026.09.01', price: 19915.00, change: '+1.50%' },
  ]);

  const weeklyHistoryList = [
    { date: '2026.10주차 (10.20 ~ 10.26)', price: 33521.21, change: '+17.83%' },
    { date: '2026.09주차 (10.13 ~ 10.19)', price: 28450.00, change: '+12.40%' },
    { date: '2026.08주차 (10.06 ~ 10.12)', price: 25300.00, change: '+8.15%' },
    { date: '2026.07주차 (09.29 ~ 10.05)', price: 23400.00, change: '+5.20%' },
  ];

  const monthlyHistoryList = [
    { date: '2026년 10월 마감', price: 33521.21, change: '+68.32%' },
    { date: '2026년 9월 마감', price: 24200.00, change: '+45.10%' },
    { date: '2026년 8월 마감', price: 21500.00, change: '+22.40%' },
    { date: '2026년 7월 마감', price: 19000.00, change: '+15.80%' },
  ];

  const getCurrentTableData = () => {
    if (perfTab === 'weekly') return weeklyHistoryList;
    if (perfTab === 'monthly') return monthlyHistoryList;
    return historyList;
  };

  const getCurrentDateRange = () => {
    if (perfTab === 'weekly') return '최근 4주간 집계';
    if (perfTab === 'monthly') return '2026.07 ~ 2026.10 월별 집계';
    return '2026.09.01 ~ 2026.10.26 (평일)';
  };

  const [tradeType, setTradeType] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [myTrades, setMyTrades] = useState([
    { id: 1, type: '매수', qty: 100, price: 32029.15, date: '2026-10-23 14:10', status: '체결완료' },
  ]);

  const [depositKrwInput, setDepositKrwInput] = useState('');
  const [withdrawKrwInput, setWithdrawKrwInput] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [adminInputData, setAdminInputData] = useState({});

  const [newDateInput, setNewDateInput] = useState('2026-10-27');
  const [newPriceInput, setNewPriceInput] = useState('');
  const [newChangeInput, setNewChangeInput] = useState('');
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, admin: 'admin', action: '기준가 등록 (33,521.21원)', time: '2026.10.26 09:00' },
  ]);

  const getKSTDateString = () => {
    const now = new Date();
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return kstDate.toISOString().replace('T', ' ').substring(0, 16);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginId || !loginPw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (loginId === 'admin' && loginPw === 'admin1234') {
      setCurrentUser({ id: 'admin', name: '플랫폼 관리자', role: 'admin' });
      setAuthModal(null);
      setActiveTab('admin');
      fetchDataFromSupabase();
      alert('관리자 계정으로 로그인되었습니다.');
      setLoginId('');
      setLoginPw('');
      return;
    }

    const found = membersList.find(m => m.id === loginId);
    if (found) {
      if (found.status === '대기중') {
        alert('아직 관리자 승인 대기 중인 계정입니다. 승인 후 이용해 주세요.');
        return;
      }
      setCurrentUser({ id: found.id, name: found.name, role: 'member', balance: found.balance, holdings: found.holdings });
      setAuthModal(null);
      setActiveTab('member');
      alert(`${found.name} 님 환영합니다!`);
      setLoginId('');
      setLoginPw('');
    } else {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupPhone || !signupEmail || !signupId || !signupPw) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (membersList.some(m => m.id === signupId)) {
      alert('이미 존재하는 아이디입니다.');
      return;
    }

    const newMemberData = {
      id: signupId,
      name: signupName,
      phone: signupPhone,
      email: signupEmail,
      password: signupPw,
      status: '대기중',
      balance: 0,
      holdings: 0
    };

    const { error } = await supabase.from('xbtf').insert([{ xbtf: JSON.stringify(newMemberData) }]);
    if (error) {
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
      return;
    }

    alert('회원가입 신청이 완료되었습니다! 관리자 승인 후 로그인하실 수 있습니다.');
    setSignupName('');
    setSignupPhone('');
    setSignupEmail('');
    setSignupId('');
    setSignupPw('');
    setAuthModal('login');
    fetchDataFromSupabase();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('main');
    alert('로그아웃 되었습니다.');
  };

  const handleApproveMember = async (targetMemberId) => {
    const { data: allRows, error: fetchError } = await supabase.from('xbtf').select('*');
    if (fetchError) {
      alert('회원 정보를 불러오는 중 오류 발생: ' + fetchError.message);
      return;
    }

    let targetRow = null;
    let updatedMemberData = null;

    for (let row of allRows) {
      try {
        let parsed = row.xbtf;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (parsed && parsed.id === targetMemberId) {
          targetRow = row;
          updatedMemberData = { ...parsed, status: '승인완료' };
          break;
        }
      } catch (e) {}
    }

    if (targetRow && updatedMemberData) {
      const updatePayload = { xbtf: JSON.stringify(updatedMemberData) };
      if (targetRow.id) updatePayload.id = targetRow.id;

      const { error: updateError } = await supabase.from('xbtf').upsert(updatePayload);
      if (updateError) {
        alert('DB 승인 처리 오류: ' + updateError.message);
        return;
      }
    }

    setMembersList(membersList.map(m => m.id === targetMemberId ? { ...m, status: '승인완료' } : m));
    alert('회원 가입이 승인되었습니다.');
    fetchDataFromSupabase();
  };

  const handleAdminSendDetails = async (reqId) => {
    const input = adminInputData[reqId] || {};
    const usdt = parseFloat(input.usdt);
    const addr = input.address;

    if (!usdt || !addr) {
      alert('안내할 USDT 수량과 입금 받을 지갑 주소를 모두 입력해주세요.');
      return;
    }

    const targetReq = depositRequests.find(r => r.id === reqId);
    if (!targetReq) return;

    const updatedReq = { ...targetReq, assignedUSDT: usdt, assignedAddress: addr, status: '입금확인대기' };

    const { data: allRows } = await supabase.from('xbtf').select('*');
    if (allRows) {
      for (let row of allRows) {
        try {
          let parsed = row.xbtf;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (parsed && parsed.id === targetReq.id) {
            const updatePayload = { xbtf: JSON.stringify(updatedReq) };
            if (row.id) updatePayload.id = row.id;
            await supabase.from('xbtf').upsert(updatePayload);
            break;
          }
        } catch (e) {}
      }
    }

    setDepositRequests(depositRequests.map(r => r.id === reqId ? updatedReq : r));
    alert('입금 안내 정보가 전송되었습니다.');
    fetchDataFromSupabase();
  };

  const handleAdminConfirmDeposit = async (reqId) => {
    const targetReq = depositRequests.find(r => r.id === reqId);
    if (!targetReq || targetReq.status === '승인완료') return;

    const memberId = targetReq.memberId;
    const addAmount = targetReq.amountKRW;
    const updatedReq = { ...targetReq, status: '승인완료' };

    const { data: allRows } = await supabase.from('xbtf').select('*');
    if (allRows) {
      for (let row of allRows) {
        try {
          let parsed = row.xbtf;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          
          if (parsed && parsed.id === targetReq.id) {
            const updatePayload = { xbtf: JSON.stringify(updatedReq) };
            if (row.id) updatePayload.id = row.id;
            await supabase.from('xbtf').upsert(updatePayload);
          }
          
          if (parsed && parsed.id === memberId) {
            const currentBal = parsed.balance || 0;
            const updatedMember = { ...parsed, balance: currentBal + addAmount };
            const updatePayload = { xbtf: JSON.stringify(updatedMember) };
            if (row.id) updatePayload.id = row.id;
            await supabase.from('xbtf').upsert(updatePayload);
          }
        } catch (e) {}
      }
    }

    setDepositRequests(depositRequests.map(r => r.id === reqId ? updatedReq : r));
    setMembersList(membersList.map(m => m.id === memberId ? { ...m, balance: m.balance + addAmount } : m));
    
    alert(`입금이 최종 확인되어 회원 계정에 ${addAmount.toLocaleString()}원이 정상 충전되었습니다!`);
    fetchDataFromSupabase();
  };

  const handleApproveWithdraw = async (reqId) => {
    const targetReq = depositRequests.find(r => r.id === reqId);
    if (!targetReq || targetReq.status === '승인완료') return;

    const updatedReq = { ...targetReq, status: '승인완료' };
    const memberId = targetReq.memberId;

    const { data: allRows } = await supabase.from('xbtf').select('*');
    if (allRows) {
      for (let row of allRows) {
        try {
          let parsed = row.xbtf;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (parsed && parsed.id === targetReq.id) {
            const updatePayload = { xbtf: JSON.stringify(updatedReq) };
            if (row.id) updatePayload.id = row.id;
            await supabase.from('xbtf').upsert(updatePayload);
          }
          if (parsed && parsed.id === memberId) {
            const currentBal = parsed.balance || 0;
            const updatedMember = { ...parsed, balance: currentBal - targetReq.amountKRW };
            const updatePayload = { xbtf: JSON.stringify(updatedMember) };
            if (row.id) updatePayload.id = row.id;
            await supabase.from('xbtf').upsert(updatePayload);
          }
        } catch (e) {}
      }
    }

    setMembersList(membersList.map(m => m.id === memberId ? { ...m, balance: m.balance - targetReq.amountKRW } : m));
    setDepositRequests(depositRequests.map(r => r.id === reqId ? updatedReq : r));
    alert('출금 신청이 최종 승인 처리되었습니다.');
    fetchDataFromSupabase();
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const krw = parseInt(depositKrwInput);
    if (!krw || krw <= 0) {
      alert('올바른 예치 금액(원화)을 입력해주세요.');
      return;
    }

    const newReq = {
      id: Date.now(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      type: 'USDT 예치(입금)',
      amountKRW: krw,
      assignedUSDT: 0,
      assignedAddress: '',
      status: '대기중',
      date: getKSTDateString()
    };

    const { error } = await supabase.from('xbtf').insert([{ xbtf: JSON.stringify(newReq) }]);
    if (error) {
      alert('예치 신청 중 오류가 발생했습니다: ' + error.message);
      return;
    }

    alert('예치 신청이 접수되었습니다! 관리자가 확인 후 입금 주소와 수량을 안내해 드립니다.');
    setDepositKrwInput('');
    fetchDataFromSupabase();
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const krw = parseInt(withdrawKrwInput);
    if (!krw || krw <= 0 || !withdrawAddress) {
      alert('올바른 출금 금액과 수신 지갑 주소를 입력해주세요.');
      return;
    }

    const newReq = {
      id: Date.now(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      type: '출금신청',
      amountKRW: krw,
      assignedUSDT: parseFloat((krw / 1350).toFixed(2)),
      assignedAddress: withdrawAddress,
      status: '대기중',
      date: getKSTDateString()
    };

    await supabase.from('xbtf').insert([{ xbtf: JSON.stringify(newReq) }]);
    alert('출금 신청이 접수되었습니다. 관리자 승인 후 처리됩니다.');
    setWithdrawKrwInput('');
    setWithdrawAddress('');
    fetchDataFromSupabase();
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!newPriceInput) return;
    const p = parseFloat(newPriceInput);
    setCurrentNav(p);
    if (newChangeInput) setDailyReturn(parseFloat(newChangeInput));
    
    const formattedDate = newDateInput.replace(/-/g, '.');
    setHistoryList([
      { date: formattedDate, price: p, change: (newChangeInput ? `+${newChangeInput}%` : '+3.50%') },
      ...historyList
    ]);

    setAuditLogs([
      { id: Date.now(), admin: currentUser?.id || 'admin', action: `기준가 업데이트 (${p.toLocaleString()}원)`, time: `${formattedDate} 15:30` },
      ...auditLogs
    ]);

    alert('기준가가 성공적으로 등록 및 반영되었습니다!');
    setNewPriceInput('');
  };

  const handleTradeSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(tradeAmount);
    if (!qty || qty <= 0) {
      alert('올바른 수량을 입력해주세요.');
      return;
    }

    const currentBal = membersList.find(m => m.id === currentUser.id)?.balance || 0;
    const currentHoldings = membersList.find(m => m.id === currentUser.id)?.holdings || 0;

    let updatedBal = currentBal;
    let updatedHoldings = currentHoldings;

    if (tradeType === 'buy') {
      const totalCost = qty * currentNav;
      if (currentBal < totalCost) {
        alert('예수금이 부족합니다. 투자금 예치 신청을 통해 충전해 주세요.');
        return;
      }
      updatedBal -= totalCost;
      updatedHoldings += qty;
    } else {
      if (currentHoldings < qty) {
        alert('보유 좌수가 부족합니다.');
        return;
      }
      updatedHoldings -= qty;
      updatedBal += (qty * currentNav);
    }

    setMembersList(membersList.map(m => m.id === currentUser.id ? { ...m, balance: updatedBal, holdings: updatedHoldings } : m));
    setCurrentUser(prev => ({ ...prev, balance: updatedBal, holdings: updatedHoldings }));

    setMyTrades([
      { 
        id: Date.now(), 
        type: tradeType === 'buy' ? '매수' : '매도', 
        qty: qty, 
        price: currentNav, 
        date: getKSTDateString(), 
        status: '체결완료' 
      },
      ...myTrades
    ]);

    alert(`${tradeType === 'buy' ? '매수' : '매도'} 주문이 정상 체결되었습니다!`);
    setTradeAmount('');
  };

  const activeMemberData = membersList.find(m => m.id === currentUser?.id) || { balance: 0, holdings: 0 };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-600 font-bold px-3 py-1 rounded text-sm tracking-wider">XBTF</span>
            <h1 className="text-lg font-semibold tracking-tight">투자 운용 플랫폼</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button 
                onClick={() => setActiveTab('main')} 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${activeTab === 'main' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                대시보드
              </button>
              
              {currentUser && currentUser.role === 'member' && (
                <button 
                  onClick={() => setActiveTab('member')} 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${activeTab === 'member' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                >
                  마이페이지
                </button>
              )}

              {currentUser && currentUser.role === 'admin' && (
                <button 
                  onClick={() => { fetchDataFromSupabase(); setActiveTab('admin'); }} 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                >
                  관리자 페이지
                </button>
              )}
            </nav>

            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-3 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                  <span className="text-blue-400 font-bold">{currentUser.name} 님</span>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> 로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setAuthModal('login')} 
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" /> 로그인
                  </button>
                  <button 
                    onClick={() => setAuthModal('signup')} 
                    className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'main' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-slate-900">ETF 운용성과 현황</h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  XBTF의 투자 현황과 누적 수익률을 확인할 수 있습니다.
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Calendar className="w-4 h-4 text-blue-600" /> {lastUpdated} 기준
                </span>
                <button 
                  onClick={() => {
                    fetchDataFromSupabase();
                    const now = new Date();
                    const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    setLastUpdated(formatted);
                    alert('최신 데이터로 갱신되었습니다.');
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition text-xs font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> 새로고침
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between text-blue-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">현재 기준가</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">{currentNav.toLocaleString()}원</div>
                <div className="text-xs text-slate-400">(1좌당 기준가격)</div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">일간 수익률</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 mb-1">▲ +{dailyReturn.toFixed(2)}%</div>
                <div className="text-xs text-slate-400">(전일 대비)</div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">주간 수익률</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 mb-1">▲ +{weeklyReturn.toFixed(2)}%</div>
                <div className="text-xs text-slate-400">(7일 기준)</div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">월간 수익률</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 mb-1">▲ +{monthlyReturn.toFixed(2)}%</div>
                <div className="text-xs text-slate-400">(30일 기준)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-lg font-bold text-slate-900">기준가격 추이</h3>
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                      {['1m', '3m', '6m', '1y'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setChartPeriod(p)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${chartPeriod === p ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          {p === '1m' ? '1개월' : p === '3m' ? '3개월' : p === '6m' ? '6개월' : '1년'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full relative bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col justify-between" style={{ minHeight: '340px' }}>
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2.5 py-1 rounded shadow z-10">
                      {currentNav.toLocaleString()}원
                    </div>
                    
                    <svg className="w-full h-72 overflow-visible pt-6" viewBox="0 0 500 160">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0,140 Q 100,110 200,80 T 400,35 T 500,15 L 500,160 L 0,160 Z" fill="url(#chartGrad)" />
                      <path d="M 0,140 Q 100,110 200,80 T 400,35 T 500,15" fill="none" stroke="#2563eb" strokeWidth="3" />
                      <circle cx="500" cy="15" r="5" fill="#2563eb" className="animate-pulse" />
                    </svg>

                    <div className="flex justify-between text-xs text-slate-400 border-t border-slate-200 pt-3 mt-2">
                      {chartDataMap[chartPeriod].map((item, idx) => (
                        <span key={idx}>{item.date}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-between">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-sm border border-slate-800">
                  <div className="text-xs font-semibold text-blue-400 mb-1">지금까지의 운용 성과는?</div>
                  <h4 className="text-lg font-bold mb-4">안정적인 수익률로 꾸준히 성장하고 있습니다.</h4>
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-700 pt-4 text-center">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">일간 수익률</div>
                      <div className="text-sm font-bold text-emerald-400">+{dailyReturn}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">주간 수익률</div>
                      <div className="text-sm font-bold text-emerald-400">+{weeklyReturn}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">월간 수익률</div>
                      <div className="text-sm font-bold text-emerald-400">+{monthlyReturn}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-slate-900 text-sm">최근 기준가 내역</h4>
                      <span 
                        onClick={() => setShowMoreModal(true)}
                        className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
                      >
                        더보기 &gt;
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {historyList.slice(0, 5).map((h, i) => (
                        <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                          <span className="text-slate-600 font-medium">{h.date}</span>
                          <span className="font-bold text-slate-900">{h.price.toLocaleString()}원</span>
                          <span className={`font-semibold ${h.change.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{h.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h3 className="text-lg font-bold text-slate-900">운용성과 상세 내역</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['daily', 'weekly', 'monthly'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setPerfTab(t)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${perfTab === t ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          {t === 'daily' ? '일별' : t === 'weekly' ? '주별' : '월별'}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      {getCurrentDateRange()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                        <th className="py-3 px-4">{perfTab === 'monthly' ? '월별 구분' : perfTab === 'weekly' ? '주차 기간' : '날짜'}</th>
                        <th className="py-3 px-4">기준가(원)</th>
                        <th className="py-3 px-4 text-right">{perfTab === 'monthly' ? '월간 변동률' : perfTab === 'weekly' ? '주간 변동률' : '일간 변동률'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {getCurrentTableData().map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-medium text-slate-700">{row.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{row.price.toLocaleString()}원</td>
                          <td className={`py-3 px-4 text-right font-semibold ${row.change.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {row.change.startsWith('-') ? '▼ ' : '▲ '}{row.change}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-blue-600" /> 확인해 주세요!
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600 leading-relaxed list-disc pl-4">
                    <li>기준가격은 펀드의 순자산가치(NAV)를 기준으로 산출되며, 매일 2회 공시됩니다.</li>
                    <li>일간, 주간, 월간 수익률은 설정일 대비 수익률을 참고하기 위한 지표입니다.</li>
                    <li>실제 수익률은 시장 상황에 따라 변동될 수 있으며, 과거 수익률이 미래 수익을 보장하지 않습니다.</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  © XBTF Asset Management. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= [더보기 >] 모달 (9월 1일~10월 26일 평일 전체 내역) ================= */}
        {showMoreModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setShowMoreModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-1">전체 기준가 내역</h3>
              <p className="text-xs text-slate-500 mb-4">9월 1일부터 10월 26일까지의 평일 일별 기준가 변동 기록입니다.</p>
              
              <div className="overflow-y-auto flex-1 pr-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50 sticky top-0">
                      <th className="py-2.5 px-3">날짜</th>
                      <th className="py-2.5 px-3">기준가(원)</th>
                      <th className="py-2.5 px-3 text-right">변동률</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {historyList.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-700">{h.date}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{h.price.toLocaleString()}원</td>
                        <td className={`py-2.5 px-3 text-right font-semibold ${h.change.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {h.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                <button 
                  onClick={() => setShowMoreModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'member' && currentUser?.role === 'member' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">회원 전용 서비스</span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{currentUser.name} 님의 마이페이지</h2>
              </div>
              <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700">계정 상태: <span className="text-emerald-600 font-bold">승인 완료 (VIP 회원)</span></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-1">보유 예수금 (KRW)</div>
                <div className="text-2xl font-extrabold text-slate-900 mb-3">{activeMemberData.balance.toLocaleString()}원</div>
                <div className="text-xs text-slate-400">USDT 환산: ${(activeMemberData.balance / 1350).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-1">펀드 보유 좌수</div>
                <div className="text-2xl font-extrabold text-blue-600 mb-3">{activeMemberData.holdings.toLocaleString()} 좌</div>
                <div className="text-xs text-slate-400">평가금액: {(activeMemberData.holdings * currentNav).toLocaleString()}원</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-1">총 자산 평가액</div>
                <div className="text-2xl font-extrabold text-emerald-600 mb-3">{(activeMemberData.balance + (activeMemberData.holdings * currentNav)).toLocaleString()}원</div>
                <div className="text-xs text-slate-400">예수금 + 펀드 평가액 합산</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-600" /> 펀드 좌수 거래 (매수/매도)
                </h3>
                <form onSubmit={handleTradeSubmit} className="space-y-4">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition cursor-pointer ${tradeType === 'buy' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      매수하기 (좌수 확보)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition cursor-pointer ${tradeType === 'sell' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      매도하기 (현금화)
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">거래 수량 (좌)</label>
                    <input 
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="매수/매도할 좌수 입력"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>적용 기준가:</span>
                      <span className="font-bold text-slate-900">{currentNav.toLocaleString()}원/좌</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예상 총액:</span>
                      <span className="font-bold text-slate-900">{((parseInt(tradeAmount) || 0) * currentNav).toLocaleString()}원</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className={`w-full font-bold py-2.5 rounded-lg text-sm transition text-white cursor-pointer ${tradeType === 'buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {tradeType === 'buy' ? '매수 주문 실행' : '매도 주문 실행'}
                  </button>
                </form>

                <div className="mt-6">
                  <h4 className="font-bold text-sm text-slate-900 mb-2">나의 거래 내역</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {myTrades.map((t) => (
                      <div key={t.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] mr-2 ${t.type === '매수' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {t.type}
                          </span>
                          <span className="font-semibold text-slate-800">{t.qty}좌 ({t.price.toLocaleString()}원)</span>
                        </div>
                        <div className="text-right text-slate-500">
                          <div>{t.date}</div>
                          <span className="text-[10px] text-emerald-600 font-semibold">{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" /> 투자금 예치 신청 (입금)
                  </h3>
                  <form onSubmit={handleDepositSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">입금할 원화 금액 (KRW)</label>
                      <input 
                        type="number"
                        value={depositKrwInput}
                        onChange={(e) => setDepositKrwInput(e.target.value)}
                        placeholder="예: 1000000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm transition cursor-pointer"
                    >
                      예치 신청하기
                    </button>
                  </form>
                </div>

                <hr className="border-slate-100" />

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Send className="w-5 h-5 text-purple-600" /> 출금 신청 (USDT 환전)
                  </h3>
                  <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">출금할 원화 금액 (KRW)</label>
                      <input 
                        type="number"
                        value={withdrawKrwInput}
                        onChange={(e) => setWithdrawKrwInput(e.target.value)}
                        placeholder="출금할 원화 입력"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">수신 USDT 지갑 주소 (TRC20)</label>
                      <input 
                        type="text"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder="지갑 주소를 입력하세요"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-sm transition cursor-pointer"
                    >
                      출금 신청하기
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">나의 입출금 및 예치 신청 내역</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                      <th className="py-3 px-4">신청 유형</th>
                      <th className="py-3 px-4">금액(KRW) / USDT</th>
                      <th className="py-3 px-4">입금 지갑 주소 / 안내</th>
                      <th className="py-3 px-4">신청 일시</th>
                      <th className="py-3 px-4">처리 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {depositRequests.filter(r => r.memberId === currentUser.id).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">신청 내역이 없습니다.</td>
                      </tr>
                    ) : (
                      depositRequests.filter(r => r.memberId === currentUser.id).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-800">{req.type}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{req.amountKRW.toLocaleString()}원</div>
                            {req.assignedUSDT > 0 && <div className="text-xs text-blue-600">{req.assignedUSDT} USDT</div>}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-600 truncate max-w-xs">
                            {req.assignedAddress || '관리자 확인 중'}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">{req.date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.status === '승인완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">시스템 관리자 모드</span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">XBTF 플랫폼 통합 관리자 센터</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchDataFromSupabase}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> DB 데이터 새로고침
                </button>
                <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  총 회원 수: <span className="font-bold text-slate-800">{membersList.length}명</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">새로운 기준가격 공시 및 등록</h3>
              <form onSubmit={handleAdminSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">공시 날짜</label>
                  <input 
                    type="date"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">새로운 기준가 (원)</label>
                  <input 
                    type="number"
                    value={newPriceInput}
                    onChange={(e) => setNewPriceInput(e.target.value)}
                    placeholder="예: 34000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">변동률 (%) 생략 가능</label>
                  <input 
                    type="text"
                    value={newChangeInput}
                    onChange={(e) => setNewChangeInput(e.target.value)}
                    placeholder="예: 4.25"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition cursor-pointer"
                >
                  기준가 등록 반영
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">회원 가입 승인 관리 (Supabase 연동 실시간)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                      <th className="py-3 px-4">아이디</th>
                      <th className="py-3 px-4">이름</th>
                      <th className="py-3 px-4">연락처</th>
                      <th className="py-3 px-4">이메일</th>
                      <th className="py-3 px-4">승인 상태</th>
                      <th className="py-3 px-4 text-right">관리 작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {membersList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800">{m.id}</td>
                        <td className="py-3 px-4">{m.name}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">{m.phone}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">{m.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${m.status === '승인완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {m.status === '대기중' && (
                            <button 
                              onClick={() => handleApproveMember(m.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition cursor-pointer"
                            >
                              승인하기
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">회원 입출금 / 예치 신청 처리 (Supabase 실시간 공유)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                      <th className="py-3 px-4">신청 회원</th>
                      <th className="py-3 px-4">유형</th>
                      <th className="py-3 px-4">신청 금액</th>
                      <th className="py-3 px-4">안내 지갑 및 USDT 설정</th>
                      <th className="py-3 px-4">상태</th>
                      <th className="py-3 px-4 text-right">조치</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {depositRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-slate-400 text-xs">접수된 입출금 신청 내역이 없습니다. (새로고침을 눌러보세요)</td>
                      </tr>
                    ) : (
                      depositRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-800">{req.memberName} ({req.memberId})</td>
                          <td className="py-3 px-4 font-semibold text-slate-700">{req.type}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{req.amountKRW.toLocaleString()}원</td>
                          <td className="py-3 px-4 text-xs space-y-1">
                            {req.type === 'USDT 예치(입금)' && req.status === '대기중' ? (
                              <div className="space-y-1">
                                <input 
                                  type="number"
                                  placeholder="USDT 수량"
                                  onChange={(e) => setAdminInputData({
                                    ...adminInputData, 
                                    [req.id]: { ...(adminInputData[req.id] || {}), usdt: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                                />
                                <input 
                                  type="text"
                                  placeholder="입금 받을 지갑 주소"
                                  onChange={(e) => setAdminInputData({
                                    ...adminInputData, 
                                    [req.id]: { ...(adminInputData[req.id] || {}), address: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="font-semibold">{req.assignedUSDT} USDT</div>
                                <div className="text-slate-400 truncate max-w-xs">{req.assignedAddress}</div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.status === '승인완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {req.status !== '승인완료' && (
                              req.type === 'USDT 예치(입금)' ? (
                                req.status === '대기중' ? (
                                  <button 
                                    onClick={() => handleAdminSendDetails(req.id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                                  >
                                    입금 안내 정보 전송
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleAdminConfirmDeposit(req.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                                  >
                                    입금 확인 및 잔고 충전 승인
                                  </button>
                                )
                              ) : (
                                <button 
                                  onClick={() => handleApproveWithdraw(req.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                                >
                                  출금 최종승인
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {authModal === 'login' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
              <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-1">로그인</h3>
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">아이디</label>
                  <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">비밀번호</label>
                  <input type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} placeholder="비밀번호" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition cursor-pointer">로그인</button>
              </form>
            </div>
          </div>
        )}

        {authModal === 'signup' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
              <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-1">회원가입 신청</h3>
              <form onSubmit={handleSignup} className="space-y-3 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">이름</label>
                  <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="실명" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">연락처</label>
                  <input type="text" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} placeholder="010-0000-0000" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">이메일</label>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="email@example.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">아이디</label>
                  <input type="text" value={signupId} onChange={(e) => setSignupId(e.target.value)} placeholder="아이디" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">비밀번호</label>
                  <input type="password" value={signupPw} onChange={(e) => setSignupPw(e.target.value)} placeholder="비밀번호" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition cursor-pointer">가입 신청하기</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}