import React, { useState, useEffect } from 'react';
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

  // 회원가입 입력 폼 상태 (휴대폰 번호, 이메일 추가)
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');

  const [membersList, setMembersList] = useState(() => {
    const saved = localStorage.getItem('xbtf_members');
    return saved ? JSON.parse(saved) : [
      { id: 'hong123', name: '홍길동', phone: '010-1234-5678', email: 'hong@example.com', status: '승인완료', role: 'member', balance: 15420000, holdings: 450 },
      { id: 'kim_vip', name: '김철수', phone: '010-9876-5432', email: 'kim@example.com', status: '대기중', role: 'member', balance: 5000000, holdings: 0 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('xbtf_members', JSON.stringify(membersList));
  }, [membersList]);

  // --- 펀드 및 대시보드 상태 관리 ---
  const [currentNav, setCurrentNav] = useState(33521.21);
  const [dailyReturn, setDailyReturn] = useState(4.70);
  const [weeklyReturn, setWeeklyReturn] = useState(17.83);
  const [monthlyReturn, setMonthlyReturn] = useState(68.32);
  
  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const chartDataMap = {
    '1m': [
      { date: '09.26', price: 24200 },
      { date: '09.30', price: 25100 },
      { date: '10.07', price: 27800 },
      { date: '10.14', price: 29400 },
      { date: '10.21', price: 30857 },
      { date: '10.26', price: currentNav },
    ],
    '3m': [
      { date: '07.26', price: 19000 },
      { date: '08.15', price: 21500 },
      { date: '09.01', price: 23000 },
      { date: '09.26', price: 24200 },
      { date: '10.14', price: 29400 },
      { date: '10.26', price: currentNav },
    ],
    '6m': [
      { date: '04.26', price: 15000 },
      { date: '06.01', price: 17200 },
      { date: '07.26', price: 19000 },
      { date: '09.01', price: 23000 },
      { date: '10.26', price: currentNav },
    ],
    '1y': [
      { date: '2025.10', price: 11000 },
      { date: '2026.01', price: 13500 },
      { date: '2026.04', price: 15000 },
      { date: '2026.07', price: 19000 },
      { date: '10.26', price: currentNav },
    ]
  };

  const [historyList, setHistoryList] = useState([
    { date: '2026.10.26', price: 33521.21, change: '+4.70%' },
    { date: '2026.10.23', price: 32029.15, change: '+3.78%' },
    { date: '2026.10.22', price: 30857.13, change: '+3.41%' },
    { date: '2026.10.21', price: 29841.27, change: '+2.95%' },
    { date: '2026.10.20', price: 28991.45, change: '+3.12%' },
    { date: '2026.10.19', price: 28111.32, change: '+2.48%' },
    { date: '2026.10.18', price: 27500.00, change: '+1.90%' },
    { date: '2026.10.17', price: 26980.50, change: '+2.10%' },
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
    return '2026.09.26 ~ 2026.10.26';
  };

  // --- 모의 투자 및 입출금 신청 상태 ---
  const [tradeType, setTradeType] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [myTrades, setMyTrades] = useState([
    { id: 1, type: '매수', qty: 100, price: 32029.15, date: '2026-10-23 14:10', status: '체결완료' },
  ]);

  const [depositRequests, setDepositRequests] = useState(() => {
    const saved = localStorage.getItem('xbtf_requests');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        memberId: 'hong123', 
        memberName: '홍길동', 
        type: 'USDT 예치(입금)', 
        amountKRW: 1350000, 
        assignedUSDT: 1000, 
        assignedAddress: 'TXYZ1234567890abcdefTRC20WalletAddressExample...', 
        status: '승인완료', 
        date: '2026-10-25 11:00' 
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('xbtf_requests', JSON.stringify(depositRequests));
  }, [depositRequests]);

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

  // --- 로그인 처리 ---
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

  // --- 회원가입 신청 (이름, 휴대폰번호, 이메일, 아이디, 비밀번호) ---
  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupName || !signupPhone || !signupEmail || !signupId || !signupPw) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (membersList.some(m => m.id === signupId)) {
      alert('이미 존재하는 아이디입니다.');
      return;
    }

    const newMember = { 
      id: signupId, 
      name: signupName, 
      phone: signupPhone, 
      email: signupEmail, 
      status: '대기중', 
      role: 'member', 
      balance: 0, 
      holdings: 0 
    };

    setMembersList([...membersList, newMember]);
    alert('회원가입 신청이 완료되었습니다! 관리자 승인 후 로그인하실 수 있습니다.');
    setSignupName('');
    setSignupPhone('');
    setSignupEmail('');
    setSignupId('');
    setSignupPw('');
    setAuthModal('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('main');
    alert('로그아웃 되었습니다.');
  };

  const handleApproveMember = (id) => {
    setMembersList(membersList.map(m => m.id === id ? { ...m, status: '승인완료' } : m));
    alert('회원 가입이 승인되었습니다.');
  };

  const handleAdminSendDetails = (reqId) => {
    const input = adminInputData[reqId] || {};
    const usdt = parseFloat(input.usdt);
    const addr = input.address;

    if (!usdt || !addr) {
      alert('안내할 USDT 수량과 입금 받을 지갑 주소를 모두 입력해주세요.');
      return;
    }

    setDepositRequests(depositRequests.map(r => {
      if (r.id === reqId) {
        return { ...r, assignedUSDT: usdt, assignedAddress: addr, status: '승인완료' };
      }
      return r;
    }));

    const targetReq = depositRequests.find(r => r.id === reqId);
    if (targetReq) {
      setMembersList(membersList.map(m => {
        if (m.id === targetReq.memberId) {
          const newBal = m.balance + targetReq.amountKRW;
          if (currentUser && currentUser.id === m.id) {
            setCurrentUser(prev => ({ ...prev, balance: newBal }));
          }
          return { ...m, balance: newBal };
        }
        return m;
      }));
    }

    alert('입금 안내 정보가 회원에게 전달되었으며, 예치 승인 및 잔고 충전이 완료되었습니다.');
  };

  const handleApproveWithdraw = (reqId) => {
    const targetReq = depositRequests.find(r => r.id === reqId);
    if (!targetReq || targetReq.status === '승인완료') return;

    setMembersList(membersList.map(m => {
      if (m.id === targetReq.memberId) {
        if (m.balance < targetReq.amountKRW) {
          alert('회원의 예수금이 부족하여 출금을 승인할 수 없습니다.');
          return m;
        }
        const newBal = m.balance - targetReq.amountKRW;
        if (currentUser && currentUser.id === m.id) {
          setCurrentUser(prev => ({ ...prev, balance: newBal }));
        }
        return { ...m, balance: newBal };
      }
      return m;
    }));

    setDepositRequests(depositRequests.map(r => r.id === reqId ? { ...r, status: '승인완료' } : r));
    alert('출금 신청이 최종 승인 처리되었습니다.');
  };

  const handleDepositSubmit = (e) => {
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
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setDepositRequests([newReq, ...depositRequests]);
    alert('예치 신청이 접수되었습니다! 관리자가 확인 후 입금 주소와 수량을 안내해 드립니다.');
    setDepositKrwInput('');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const krw = parseInt(withdrawKrwInput);
    if (!krw || krw <= 0 || !withdrawAddress) {
      alert('올바른 출금 금액과 수신 지갑 주소를 입력해주세요.');
      return;
    }
    const krwExchangeRate = 1350;
    const usdtAmount = parseFloat((krw / krwExchangeRate).toFixed(2));

    if (activeMemberData.balance < krw) {
      alert('출금 가능 예수금이 부족합니다.');
      return;
    }

    const newReq = {
      id: Date.now(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      type: '출금신청',
      amountKRW: krw,
      assignedUSDT: usdtAmount,
      assignedAddress: withdrawAddress,
      status: '대기중',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setDepositRequests([newReq, ...depositRequests]);
    alert('출금 신청이 접수되었습니다. 관리자 승인 후 처리됩니다.');
    setWithdrawKrwInput('');
    setWithdrawAddress('');
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

    const currentBal = currentUser.id === 'admin' ? 0 : (membersList.find(m => m.id === currentUser.id)?.balance || 0);
    const currentHoldings = currentUser.id === 'admin' ? 0 : (membersList.find(m => m.id === currentUser.id)?.holdings || 0);

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
        date: new Date().toISOString().replace('T', ' ').substring(0, 16), 
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
      {/* 상단 네비게이션 */}
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
                  onClick={() => setActiveTab('admin')} 
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

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ================= 대시보드 (메인) ================= */}
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

            {/* 4개 지표 카드 */}
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

            {/* 차트 영역과 우측 요약 카드 */}
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
                          <span className="text-emerald-600 font-semibold">{h.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 상세 내역 테이블 */}
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
                          <td className="py-3 px-4 text-right font-semibold text-emerald-600">▲ {row.change}</td>
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

        {/* ================= 마이페이지 (회원 전용) ================= */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-1">총 평가금액</div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {(activeMemberData.holdings * currentNav + activeMemberData.balance).toLocaleString()}원
                </div>
                <div className="text-xs text-emerald-600 mt-2 font-semibold">▲ 수익률 +24.8% (기준가 대비)</div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-1">보유 좌수 / 평가액</div>
                <div className="text-2xl font-extrabold text-blue-600">{activeMemberData.holdings}좌</div>
                <div className="text-xs text-slate-400 mt-2">평가액: {(activeMemberData.holdings * currentNav).toLocaleString()}원</div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-1">출금 가능 예수금</div>
                <div className="text-2xl font-extrabold text-slate-900">{activeMemberData.balance.toLocaleString()}원</div>
                <div className="text-xs text-slate-400 mt-2">즉시 출금 가능</div>
              </div>
            </div>

            {/* 원화 금액 예치 신청 및 출금 신청 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 text-md mb-3">
                  <Wallet className="w-5 h-5 text-blue-600" /> 투자금 예치 신청 (원화)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  예치할 원화 금액을 입력하고 신청해 주시면, 관리자가 확인 후 입금할 TRC20 지갑 주소와 USDT 수량을 안내해 드립니다.
                </p>
                <form onSubmit={handleDepositSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">예치 신청 금액 (원화)</label>
                    <input 
                      type="number" 
                      placeholder="예: 1350000" 
                      value={depositKrwInput} 
                      onChange={(e) => setDepositKrwInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow transition cursor-pointer"
                  >
                    입금 안내 요청하기
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 text-md mb-3">
                  <ArrowUpRight className="w-5 h-5 text-rose-600" /> 투자금 출금 신청
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  보유 중인 예수금을 본인의 암호화폐 지갑(TRC20)으로 출금 신청합니다. 관리자 승인 후 처리됩니다.
                </p>
                <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">출금 신청 금액 (원화)</label>
                    <input 
                      type="number" 
                      placeholder="예: 500000" 
                      value={withdrawKrwInput} 
                      onChange={(e) => setWithdrawKrwInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">수신 지갑 주소 (TRC20)</label>
                    <input 
                      type="text" 
                      placeholder="받으실 USDT 지갑 주소 입력" 
                      value={withdrawAddress} 
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg text-sm shadow transition cursor-pointer"
                  >
                    출금 신청하기
                  </button>
                </form>
              </div>
            </div>

            {/* 나의 입출금 신청 내역 및 안내 확인 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-md mb-4">펀드 모의 매수·매도 주문</h3>
                <div className="flex space-x-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition cursor-pointer ${tradeType === 'buy' ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-600'}`}
                  >
                    매수하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition cursor-pointer ${tradeType === 'sell' ? 'bg-rose-600 text-white shadow' : 'bg-slate-100 text-slate-600'}`}
                  >
                    매도하기
                  </button>
                </div>

                <form onSubmit={handleTradeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">적용 기준가</label>
                    <input 
                      type="text" 
                      disabled 
                      value={`${currentNav.toLocaleString()} 원 / 1좌`} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">주문 수량 (좌)</label>
                    <input 
                      type="number" 
                      placeholder="예: 50" 
                      value={tradeAmount} 
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">예상 거래 금액:</span>
                      <span className="font-bold text-slate-900">
                        {tradeAmount ? (parseInt(tradeAmount || 0) * currentNav).toLocaleString() : 0} 원
                      </span>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className={`w-full py-2.5 rounded-lg text-white font-bold text-sm shadow transition cursor-pointer ${tradeType === 'buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                  >
                    {tradeType === 'buy' ? '매수 주문 실행' : '매도 주문 실행'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-md mb-4">나의 입출금 신청 및 안내 내역</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                        <th className="py-3 px-4">구분</th>
                        <th className="py-3 px-4">신청 금액</th>
                        <th className="py-3 px-4 min-w-[220px]">관리자 안내 (지갑 주소 및 수량)</th>
                        <th className="py-3 px-4">상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {depositRequests.filter(r => r.memberId === currentUser.id).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${req.type.includes('예치') ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                              {req.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{req.amountKRW.toLocaleString()}원</td>
                          <td className="py-3 px-4 text-xs text-slate-700">
                            {req.status === '승인완료' ? (
                              <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1">
                                <div className="font-bold text-blue-600">입금 USDT: {req.assignedUSDT} USDT</div>
                                <div className="text-slate-600 break-all select-all font-mono bg-white p-1 rounded border border-slate-100">
                                  주소: {req.assignedAddress}
                                </div>
                              </div>
                            ) : (
                              <span className="text-amber-600 font-medium">관리자 확인 및 안내 대기 중...</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${req.status === '승인완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 관리자 페이지 ================= */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">운영자 전용</span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">XBTF 플랫폼 관리자 대시보드</h2>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 기준가 등록 카드 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-md mb-4">신규 기준가 및 수익률 등록</h3>
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">적용 일자</label>
                    <input 
                      type="date" 
                      value={newDateInput} 
                      onChange={(e) => setNewDateInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">신규 기준가 (원)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="예: 34100.50" 
                      value={newPriceInput} 
                      onChange={(e) => setNewPriceInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">일간 변동률 (%)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="예: 2.15" 
                      value={newChangeInput} 
                      onChange={(e) => setNewChangeInput(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg text-sm shadow transition cursor-pointer"
                  >
                    기준가 등록 및 실시간 반영
                  </button>
                </form>
              </div>

              {/* 입출금 신청 및 답변/승인 관리 카드 */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-md mb-3">회원 투자금 예치 및 출금 요청 관리</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                          <th className="py-2.5 px-3">회원명</th>
                          <th className="py-2.5 px-3">요청 유형</th>
                          <th className="py-2.5 px-3">신청 금액</th>
                          <th className="py-2.5 px-3 min-w-[240px]">관리자 답변 입력 (지갑주소 & USDT)</th>
                          <th className="py-2.5 px-3 text-right">처리</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {depositRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{req.memberName}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 text-xs font-bold rounded ${req.type.includes('예치') ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                                {req.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-xs font-semibold">{req.amountKRW.toLocaleString()}원</td>
                            <td className="py-2.5 px-3 text-xs">
                              {req.status === '대기중' && req.type.includes('예치') ? (
                                <div className="space-y-1.5 py-1">
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="입금받을 USDT 수량" 
                                    onChange={(e) => setAdminInputData({
                                      ...adminInputData, 
                                      [req.id]: { ...(adminInputData[req.id] || {}), usdt: e.target.value }
                                    })}
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="입금받을 TRC20 지갑 주소" 
                                    onChange={(e) => setAdminInputData({
                                      ...adminInputData, 
                                      [req.id]: { ...(adminInputData[req.id] || {}), address: e.target.value }
                                    })}
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                  />
                                </div>
                              ) : (
                                <div className="text-slate-700 break-all">
                                  <span className="font-bold text-blue-600">{req.assignedUSDT} USDT</span> / <span className="font-mono text-[11px]">{req.assignedAddress}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {req.status === '대기중' ? (
                                req.type.includes('예치') ? (
                                  <button 
                                    onClick={() => handleAdminSendDetails(req.id)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition cursor-pointer flex items-center gap-1 ml-auto"
                                  >
                                    <Send className="w-3 h-3" /> 답변 및 승인
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleApproveWithdraw(req.id)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition cursor-pointer ml-auto"
                                  >
                                    출금 승인
                                  </button>
                                )
                              ) : (
                                <span className="text-xs text-emerald-600 font-bold">완료됨</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 회원 가입 승인 관리 테이블 (연락처 및 이메일도 표시) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-md mb-3">신규 회원 가입 승인 관리</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                          <th className="py-2.5 px-3">이름 / 아이디</th>
                          <th className="py-2.5 px-3">휴대폰 번호</th>
                          <th className="py-2.5 px-3">이메일</th>
                          <th className="py-2.5 px-3">상태</th>
                          <th className="py-2.5 px-3 text-right">가입 승인</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {membersList.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-slate-900 block">{m.name}</span>
                              <span className="text-xs text-slate-400 font-medium">({m.id})</span>
                            </td>
                            <td className="py-2.5 px-3 text-xs text-slate-700 font-mono">{m.phone || '-'}</td>
                            <td className="py-2.5 px-3 text-xs text-slate-700">{m.email || '-'}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 text-xs font-bold rounded ${m.status === '승인완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {m.status === '대기중' ? (
                                <button 
                                  onClick={() => handleApproveMember(m.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-semibold transition cursor-pointer"
                                >
                                  승인하기
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">승인됨</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= 로그인 모달 ================= */}
      {authModal === 'login' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">로그인</h3>
              <button onClick={() => setAuthModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">아이디</label>
                <input 
                  type="text" 
                  placeholder="아이디 입력" 
                  value={loginId} 
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">비밀번호</label>
                <input 
                  type="password" 
                  placeholder="비밀번호 입력" 
                  value={loginPw} 
                  onChange={(e) => setLoginPw(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-750 text-white font-bold py-2.5 rounded-lg text-sm shadow transition cursor-pointer mt-2"
              >
                로그인하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= 회원가입 모달 (이름, 휴대폰번호, 이메일, 아이디, 비밀번호) ================= */}
      {authModal === 'signup' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">회원가입 신청</h3>
              <button onClick={() => setAuthModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">이름</label>
                <input 
                  type="text" 
                  placeholder="예: 홍길동" 
                  value={signupName} 
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">휴대폰 번호</label>
                <input 
                  type="tel" 
                  placeholder="예: 010-1234-5678" 
                  value={signupPhone} 
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">이메일 주소</label>
                <input 
                  type="email" 
                  placeholder="예: user@example.com" 
                  value={signupEmail} 
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">아이디</label>
                <input 
                  type="text" 
                  placeholder="사용할 아이디 입력" 
                  value={signupId} 
                  onChange={(e) => setSignupId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">비밀번호</label>
                <input 
                  type="password" 
                  placeholder="사용할 비밀번호 입력" 
                  value={signupPw} 
                  onChange={(e) => setSignupPw(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <p className="text-xs text-slate-500 pt-1">
                ℹ️ 회원가입 신청 후 관리자의 승인이 완료되면 마이페이지 이용이 가능합니다.
              </p>
              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm shadow transition cursor-pointer mt-2"
              >
                가입 신청하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= [더보기] 모달 창 ================= */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">전체 기준가 내역</h3>
              <button onClick={() => setShowMoreModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {historyList.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700">{item.date}</span>
                  <span className="font-bold text-slate-900">{item.price.toLocaleString()}원</span>
                  <span className="font-semibold text-emerald-600">{item.change}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setShowMoreModal(false)} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}