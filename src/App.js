// src/App.js
// 리액트 훅과 필요한 컴포넌트, Firebase 관련 라이브러리 임포트
import React, { useState, useRef, useEffect } from 'react';
import PreviousHikes from './PreviousHikes';
import { db } from './firebase';
import { ref, set, push, onValue, query, limitToLast, get } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// 최근 산행 사진들 (임시 이미지 - 추후 실제 데이터베이스 사진으로 대체 예정)
const latestPhotos = [
  'https://i.imgur.com/cqdhHsH.jpg',
  'https://i.imgur.com/C3cdN8y.jpg',
  'https://i.imgur.com/YDTdPjx.jpg',
  'https://i.imgur.com/rDsGHs6.jpg',
];

// 최근 산행 정보 객체 - 산행의 주요 세부사항 저장
// 이 객체는 최근 산행의 정보를 저장합니다.
// eslint-disable-next-line no-unused-vars
const latestHiking = {
  date: '최근산행 2025.05.13(화)', // 산행 날짜
  location: '의외의 전망 맛집!봉산', // 산행 장소
  participants: '9', // 참가자 수
  distance: '6km', // 총 거리
  difficulty: '초급', // 난이도
  comment: '즐거운 산행이었습니다.모두 고생하셨습니다.\n마지막 계산까지 책임진 병수동지 감사~~^^' // 산행 후기
};

const nextHiking = {
  date: '최근산행 2025.05.30(금)', // 산행 날짜
  location: '치유의 길! 북한산 우이령길', // 산행 장소
  participants: '10', // 참가자 수
  distance: '6.8km', // 총 거리
  difficulty: '초급', // 난이도
  comment: '석구라 강추! 석굴암 절경이였습니다.\n' // 산행 안내
};

// 컨테이너 스타일 - 앱의 전체 레이아웃을 정의합니다.
const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0
};

const titleStyle = {
  margin: '24px 0 18px 0',
  fontWeight: 700,
  textAlign: 'center',
  letterSpacing: '-1px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const galleryGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  marginBottom: 18,
  background: 'rgba(255,255,255,0.8)',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  maxWidth: 420,
  width: '95vw',
  alignItems: 'flex-start',
  position: 'relative'
};

const thumbnailStyle = {
  width: '33%',
  height: '90px',
  objectFit: 'cover',
  borderRadius: 12,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  transformOrigin: 'left center',
  position: 'relative',
  zIndex: 0
};

const commentSectionStyle = {
  width: '100%',
  maxWidth: 420,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
  borderRadius: 16,
  padding: '20px',
  marginTop: 10,
  marginBottom: 18,
  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.3)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  textAlign: 'center'
};

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  alignItems: 'center',
  textAlign: 'center'
};

const dateStyle = {
  fontSize: '0.9rem',
  color: '#666',
  fontWeight: 500
};

const locationStyle = {
  fontSize: '1.1rem',
  color: '#2d3a4b',
  fontWeight: 700
};

const infoStyle = {
  display: 'flex',
  gap: '24px',
  marginTop: '12px',
  justifyContent: 'center'
};

const infoItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#444',
  fontSize: '0.95rem',
  whiteSpace: 'nowrap'
};

const iconStyle = {
  fontSize: '1.1rem'
};

const commentTextStyle = {
  margin: '16px 0 0 0',
  lineHeight: 1.5,
  color: '#666',
  fontSize: '0.95rem'
};

const navButtonGroupStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: 16,
  width: '100%',
  maxWidth: 420,
  margin: '0 auto 24px auto',
  justifyContent: 'center'
};

const navButtonStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 14,
  color: '#fff',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '16px 0 10px 0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  cursor: 'pointer',
  minWidth: 0,
  minHeight: 60,
  transition: 'background 0.2s'
};

const navIconStyle = {
  fontSize: '1.5rem',
  marginBottom: 4
};

const dummyPageStyle = {
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const backBtnStyle = {
  marginTop: 24,
  padding: '10px 24px',
  borderRadius: 8,
  border: 'none',
  background: '#4f8cff',
  color: '#fff',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer'
};

// 모달 관련 스타일 추가
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  cursor: 'pointer'
};

const modalImageStyle = {
  maxWidth: '90%',
  maxHeight: '90vh',
  objectFit: 'contain',
  borderRadius: 8
};

// 댓글 섹션 스타일 추가
const commentContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '58%',
  height: '400px',
  padding: '0 10px',
  boxSizing: 'border-box',
  marginLeft: '10px',
  position: 'relative'
};

const commentInputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  resize: 'none',
  marginBottom: '10px',
  fontSize: '0.9rem',
  boxSizing: 'border-box'
};

const commentListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  overflowY: 'auto',
  flex: 1
};

const commentItemStyle = {
  padding: '8px 12px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  fontSize: '0.9rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  wordBreak: 'break-word'
};

const commentTimestampStyle = {
  fontSize: '0.7rem',
  color: '#888',
  marginTop: '4px',
  textAlign: 'right'
};

const showMoreButtonStyle = {
  alignSelf: 'flex-end',
  border: 'none',
  background: 'transparent',
  color: '#4f8cff',
  cursor: 'pointer',
  fontWeight: 'bold',
  padding: '5px',
  fontSize: '0.9rem',
  marginTop: '10px'
};

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState('main');
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const commentInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  

  // Firebase 익명 로그인
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Anonymous sign-in successful.");
      })
      .catch((error) => {
        console.error("Anonymous sign-in failed:", error);
      });

    // 로그인 상태 추적
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        setUser(user);
      } else {
        console.log("User is signed out.");
        setUser(null);
      }
    });
    // 컴포넌트 언마운트 시 인증 리스너 해제
    return () => unsubscribeAuth();
  }, []);

  // Firebase에서 코멘트 불러오기 + 콘솔 로그 추가
  useEffect(() => {
    // 로그인 상태 확인 후 DB 접근
    if (!user) {
      console.log("User not authenticated yet, skipping comment fetch.");
      return; // 아직 로그인 안됐으면 데이터 요청 안함
    }
    console.log("Fetching comments for user:", user.uid);

    const commentsRef = ref(db, 'comments');
    // 최신 5개 또는 전체 (Timestamp 기준으로 정렬 고려 - 현재는 키 순서)
    const commentsQuery = showAllComments
      ? query(commentsRef) // 필요시 orderByChild('timestamp') 추가
      : query(commentsRef, limitToLast(5)); // 필요시 orderByChild('timestamp') 추가

    const unsubscribeDB = onValue(commentsQuery, (snapshot) => {
      console.log("Firebase snapshot received:", snapshot.val()); // <-- 데이터 확인용 로그
      const data = snapshot.val();
      if (data) {
        const commentsArray = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          // timestamp 기준으로 내림차순(최신순) 정렬
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        console.log("Processed comments (sorted):", commentsArray); // <-- 처리된 배열 확인용 로그
        setComments(commentsArray);
      } else {
        console.log("No comments data found in snapshot."); // <-- 데이터 없을 때 로그
        setComments([]);
      }
    }, (error) => {
      // 데이터 읽기 오류 처리
      console.error("Error fetching comments:", error);
      // 예: 권한 오류 발생 시 로그 확인 가능
      if (error.code === 'PERMISSION_DENIED') {
          console.error("PERMISSION_DENIED: Check your Realtime Database rules and authentication state.");
      }
    });

    // 컴포넌트 언마운트 또는 showAllComments 변경 시 DB 리스너 해제
    return () => {
      console.log("Unsubscribing from DB listener.");
      unsubscribeDB();
    }
  }, [showAllComments, user]); // user 상태가 변경될 때도 effect 재실행

  // comments 상태 변경 확인용 로그 (디버깅용)
  useEffect(() => {
    console.log("Comments state updated:", comments);
  }, [comments]);

  // 댓글 추가 함수 (수정 완료)
  const addComment = () => {
    if (commentInput.trim()) {
      if (!user) {
        console.error("Cannot add comment: User not signed in.");
        alert('로그인 중입니다. 잠시 후 다시 시도해주세요.'); // 사용자에게 안내
        return;
      }
      const commentsRef = ref(db, 'comments');
      const newCommentRef = push(commentsRef);

      set(newCommentRef, {
        message: commentInput.trim(),
        timestamp: new Date().toISOString(),
        userId: user.uid // 현재 로그인된 사용자의 ID 추가
      })
      .then(() => {
          console.log("Comment added successfully!");
          setCommentInput(''); // 성공 시 입력창 비우기
      })
      .catch((error) => {
          console.error("Error adding comment:", error);
          alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
          // 예: 권한 오류 발생 시 로그 확인 가능
          if (error.code === 'PERMISSION_DENIED') {
              console.error("PERMISSION_DENIED: Check your Realtime Database rules and authentication state.");
          }
      });
    }
  };

  // 엔터키 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  // 표시할 댓글 목록 (Firebase에서 정렬해서 가져오므로 그대로 사용)
  const displayedComments = comments;

  // 페이지 전환 함수
  const goToPrevious = () => setPage('previous');
  const goToAttendance = () => window.open('https://drive.google.com/file/d/1sWutn4J1UQC3U0jXPrm7TV8xbaudn8pa/view?usp=sharing', '_blank');
  const goToFee = () => window.open('https://docs.google.com/spreadsheets/d/1Sy2fHW-HJ0jE9hUZYH_ytBRqQfFQi4Pg/edit?usp=sharing&ouid=112996001461247382287&rtpof=true&sd=true', '_blank');
  const goToMain = () => setPage('main');

  // 출석부, 회비내역은 아직 미구현이므로 임시 화면
  const renderAttendance = () => (
    <div style={dummyPageStyle}>
      <h2>출석부</h2>
      <button style={backBtnStyle} onClick={goToMain}>메인으로</button>
    </div>
  );
  const renderFee = () => (
    <div style={dummyPageStyle}>
      <h2>회비 내역</h2>
      <button style={backBtnStyle} onClick={goToMain}>메인으로</button>
    </div>
  );

  // 코멘트만 새로고침하는 함수
  const refreshComments = () => {
    if (!user) {
      console.log("User not authenticated yet, skipping comment refresh.");
      return;
    }
    
    setIsRefreshing(true); // 새로고침 상태 시작
    
    const commentsRef = ref(db, 'comments');
    const commentsQuery = showAllComments
      ? query(commentsRef)
      : query(commentsRef, limitToLast(5));
    
    // Firebase에서 데이터 한 번만 가져오기
    get(commentsQuery)
      .then((snapshot) => {
        console.log("Firebase snapshot received on refresh:", snapshot.val());
        const data = snapshot.val();
        if (data) {
          const commentsArray = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          console.log("Refreshed comments:", commentsArray);
          setComments(commentsArray);
        } else {
          console.log("No comments data found on refresh.");
          setComments([]);
        }
      })
      .catch((error) => {
        console.error("Error refreshing comments:", error);
      })
      .finally(() => {
        // 새로고침 상태 종료(성공, 실패 모두)
        setIsRefreshing(false);
      });
  };

  // '더보기' 버튼 클릭 시 처리 함수
  const handleShowMoreClick = () => {
    setShowAllComments(true); // 모든 코멘트 보기 상태로 변경
    refreshComments(); // 코멘트 새로고침
  };

  // '접기' 버튼 클릭 시 처리 함수
  const handleShowLessClick = () => {
    setShowAllComments(false); // 일부 코멘트만 보기 상태로 변경
    refreshComments(); // 코멘트 새로고침
  };

  // 페이지 분기 구조
  if (page === 'previous') {
    return (
      <div style={containerStyle}>
        <PreviousHikes />
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button style={backBtnStyle} onClick={goToMain}>메인으로</button>
        </div>
        {/* 방문자 카운터 */}
        <div
          style={{
            position: 'fixed',
            right: 10,
            bottom: 8,
            zIndex: 100,
            fontSize: '0.8rem',
            opacity: 0.7
          }}
        >
          <a href="https://www.hitwebcounter.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://hitwebcounter.com/counter/counter.php?page=20524626&style=0006&nbdigits=3&type=page&initCount=0"
              title="Counter Widget"
              alt="Visit counter For Websites"
              style={{ height: 18, verticalAlign: 'middle', border: 0 }}
            />
          </a>
        </div>
      </div>
    );
  }

  if (page === 'attendance') {
    return (
      <div style={containerStyle}>
        {renderAttendance()}
        {/* 방문자 카운터 */}
        <div
          style={{
            position: 'fixed',
            right: 10,
            bottom: 8,
            zIndex: 100,
            fontSize: '0.8rem',
            opacity: 0.7
          }}
        >
          <a href="https://www.hitwebcounter.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://hitwebcounter.com/counter/counter.php?page=20524626&style=0006&nbdigits=3&type=page&initCount=0"
              title="Counter Widget"
              alt="Visit counter For Websites"
              style={{ height: 18, verticalAlign: 'middle', border: 0 }}
            />
          </a>
        </div>
      </div>
    );
  }

  if (page === 'fee') {
    return (
      <div style={containerStyle}>
        {renderFee()}
        {/* 방문자 카운터 */}
        <div
          style={{
            position: 'fixed',
            right: 10,
            bottom: 8,
            zIndex: 100,
            fontSize: '0.8rem',
            opacity: 0.7
          }}
        >
          <a href="https://www.hitwebcounter.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://hitwebcounter.com/counter/counter.php?page=20524626&style=0006&nbdigits=3&type=page&initCount=0"
              title="Counter Widget"
              alt="Visit counter For Websites"
              style={{ height: 18, verticalAlign: 'middle', border: 0 }}
            />
          </a>
        </div>
      </div>
    );
  }

  // 메인 페이지
  return (
    <div style={containerStyle}>
      {/* 테스트 버전 안내 코멘트: 제목 위에 배치 */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          textAlign: 'right', // 우측 정렬
          color: '#aaa',
          fontSize: '0.95rem',
          fontWeight: 600,
          opacity: 0.95,
          padding: '12px 0 0 0',
          whiteSpace: 'pre-line', // 줄바꿈 처리
        }}
      >
        ※ 테스트 버전.{"\n"}개선의견 환영합니다
      </div>

      {/* 제목 */}
      <h1 style={{...titleStyle, color: '#43c59e'}} className="main-title">
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <img 
            src="/korail_logo.png"
            alt="KORAIL" 
            style={{
              height: '40px',  // 36px의 3배
              width: 'auto',
              verticalAlign: 'middle'
            }}
          />
          <span style={{ 
            fontSize: '1.2em',
            color: '#333'
          }}>
            수색차량
          </span>
        </div>
        우리산악회 산행 갤러리
      </h1>

      {/* 2. 사진 갤러리 */}
      <div style={{
        ...galleryGridStyle,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }} className="gallery-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '38%' }}>
          {latestPhotos.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`최신 산행 사진 ${idx + 1}`}
              style={{...thumbnailStyle, width: '100%'}}
              className="thumbnail"
              onClick={() => setSelectedImage(url)}
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) {
                  e.target.style.transform = 'scale(3)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  e.target.style.zIndex = '10';
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth > 768) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.target.style.zIndex = '0';
                }
              }}
            />
          ))}
        </div>
        
        {/* 댓글 섹션 */}
        <div style={commentContainerStyle}>
          <textarea
            ref={commentInputRef}
            style={commentInputStyle}
            placeholder={user ? "코멘트를 입력하세요 (엔터키로 등록)" : "로그인 중..."}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={!user}
          />
          
          <div style={commentListStyle}>
            {displayedComments.length === 0 && user && (
              <div style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>
                {isRefreshing ? '코멘트를 불러오는 중...' : '첫 코멘트를 남겨보세요!'}
              </div>
            )}
            {displayedComments.map((comment) => (
              <div key={comment.id} style={commentItemStyle}>
                <div>{comment.message}</div>
                <div style={commentTimestampStyle}>
                  {new Date(comment.timestamp).toLocaleString('ko-KR', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* 새로고침 및 더보기/접기 버튼 컨테이너 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
            {/* 새로고침 버튼은 제거합니다 */}

            {/* 더보기/접기 버튼 */}
            <div>
              {comments.length >= 5 && !showAllComments && (
                 <button
                   style={showMoreButtonStyle}
                   onClick={handleShowMoreClick}
                 >
                   더보기
                 </button>
              )}
               {showAllComments && (
                 <button
                   style={showMoreButtonStyle}
                   onClick={handleShowLessClick}
                 >
                   접기
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* 다음 산행 정보 */}
      <div style={commentSectionStyle} className="comment-section">
        <div style={{ position: 'relative' }}>
          {/* 빨강배너 및 산행 정보 */}
          {/* 빨강배너 시작 - 필요시 주석 처리 가능 */}
          {false && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '-20px',
                background: 'rgba(255, 0, 0, 0.8)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: '4px 8px',
                transform: 'rotate(-45deg)',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              우천 취소
            </div>
          )}
          {/* 빨강배너 끝 */}

          {/* 다음 산행 정보 */}
          <div style={{...headerStyle, marginTop: '5px'}} className="header">
            <span style={{...dateStyle, color: '#4a90e2'}}>{nextHiking.date}</span>
            <span style={locationStyle}>{nextHiking.location}</span>
          </div>
          <div style={infoStyle} className="hiking-info">
            <span style={infoItemStyle}>
              <span style={iconStyle}>👥</span>
              {nextHiking.participants}명
            </span>
            <span style={infoItemStyle}>
              <span style={iconStyle}>🗺️</span>
              {nextHiking.distance}
            </span>
            <span style={infoItemStyle}>
              <span style={iconStyle}>⛰️</span>
              {nextHiking.difficulty}
            </span>
          </div>
          <p style={commentTextStyle}>
            {nextHiking.comment.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* 2. 하단 버튼 */}
      <div style={navButtonGroupStyle} className="nav-button-group">
        <button
          style={{ ...navButtonStyle, background: '#4f8cff' }}
          onClick={goToPrevious}
        >
          <span style={navIconStyle}>🗂️</span>
          <span>산행사진</span>
        </button>
        <button
          style={{ ...navButtonStyle, background: '#43c59e' }}
          onClick={goToAttendance}
        >
          <span style={navIconStyle}>📝</span>
          <span>산행출석부</span>
        </button>
        <button
          style={{ ...navButtonStyle, background: '#ffb400' }}
          onClick={goToFee}
        >
          <span style={navIconStyle}>💰</span>
          <span>회비내역</span>
        </button>
      </div>

      {/* 3. 최근 산행 정보 - 임시 숨김 */}
      {/*
      <div style={commentSectionStyle} className="comment-section">
        <div style={{ position: 'relative' }}>
          <div style={headerStyle} className="header">
            <span style={dateStyle}>{latestHiking.date}</span>
            <span style={locationStyle}>{latestHiking.location}</span>
          </div>
          <div style={infoStyle} className="hiking-info">
            <span style={infoItemStyle}>
              <span style={iconStyle}>👥</span>
              {latestHiking.participants}명
            </span>
            <span style={infoItemStyle}>
              <span style={iconStyle}>🗺️</span>
              {latestHiking.distance}
            </span>
            <span style={infoItemStyle}>
              <span style={iconStyle}>⛰️</span>
              {latestHiking.difficulty}
            </span>
          </div>
          <p style={commentTextStyle}>
            {latestHiking.comment.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
      */}

      {/* 모바일 스타일 */}
      <style>
        {`
          @media (max-width: 600px) {
            .main-title img {
              height: 40px !important;  // 30px의 3배
            }
            .main-title {
              font-size: 9vw !important;
              padding: 0 4vw !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              text-align: center !important;
              color: #43c59e !important;
            }
            .gallery-grid {
              flex-direction: row !important;
              gap: 8px !important;
              padding: 10px !important;
              width: 95vw !important;
              max-width: 95vw !important;
              align-items: flex-start !important;
              position: relative !important;
            }
            .thumbnail {
              width: 100% !important;
              height: 70px !important;
              position: relative !important;
            }
            .comment-section {
              width: 95vw !important;
              max-width: 95vw !important;
              margin: 12px auto !important;
              padding: 12px !important;
              box-sizing: border-box !important;
            }
            .header {
              align-items: center !important;
              text-align: center !important;
            }
            .hiking-info {
              justify-content: center !important;
              gap: 15px !important;
              margin-top: 8px !important;
            }
            .nav-button-group {
              flex-direction: row !important;
              gap: 10px !important;
              width: 95vw !important;
              margin: 0 auto 20px auto !important;
              justify-content: center !important;
            }
            .nav-btn {
              font-size: 0.9rem !important;
              padding: 10px 0 !important;
            }
            /* 모바일에서 댓글 섹션 스타일 */
            .gallery-grid > div:first-child {
              width: 45% !important;
            }
            .gallery-grid > div:last-child {
              width: 52% !important;
              margin-left: 3% !important;
              margin-top: 0 !important;
              height: 300px !important;
            }
          }

          /* 호버 효과를 위한 z-index 관리 */
          .thumbnail:hover {
            z-index: 10 !important;
          }
        `}
      </style>

      {/* 방문자 카운터: 하단 우측에 고정 */}
      <div
        style={{
          position: 'fixed',
          right: 10,
          bottom: 8,
          zIndex: 100,
          fontSize: '0.8rem',
          opacity: 0.7
        }}
      >
        <a href="https://www.hitwebcounter.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://hitwebcounter.com/counter/counter.php?page=20524626&style=0006&nbdigits=3&type=page&initCount=0"
            title="Counter Widget"
            alt="Visit counter For Websites"
            style={{ height: 18, verticalAlign: 'middle', border: 0 }}
          />
        </a>
      </div>

      {/* 이미지 모달 */}
      {selectedImage && (
        <div 
          style={modalStyle} 
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="확대된 산행 사진"
            style={modalImageStyle}
          />
        </div>
      )}
    </div>
  );
}

export default App;
