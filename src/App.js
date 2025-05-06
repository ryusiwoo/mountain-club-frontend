// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import PreviousHikes from './PreviousHikes';

const latestPhotos = [
  // 임시 이미지 (나중에 실제 사진 url로 교체)
  'https://i.imgur.com/cqdhHsH.jpg',
  'https://i.imgur.com/C3cdN8y.jpg',
  'https://i.imgur.com/YDTdPjx.jpg',
  'https://i.imgur.com/rDsGHs6.jpg',
];

// 최근 산행 정보
const latestHiking = {
  date: 'NEXT산행 2025.05.09(금)',
  location: '의외의 전망 맛집!봉산',
  participants: '00',
  distance: '6km',
  difficulty: '초급',
  comment: '사패산에 이어 다시 만난 C조 & D조!\n비회원도 환영~ \n 질투말고 B조도 함께해요~'
};

// 초기 댓글 데이터
const initialComments = [
  { id: 1, text: '멋진 사진이네요!', timestamp: new Date().toISOString() },
  { id: 2, text: '다음 산행이 기대돼요~', timestamp: new Date().toISOString() },
  { id: 3, text: '저도 참여하고 싶어요', timestamp: new Date().toISOString() },
];

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
  const [comments, setComments] = useState(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const commentInputRef = useRef(null);

  // 로컬 스토리지에서 댓글 불러오기
  useEffect(() => {
    const savedComments = localStorage.getItem('mountainClubComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // 댓글 저장
  useEffect(() => {
    localStorage.setItem('mountainClubComments', JSON.stringify(comments));
  }, [comments]);

  // 댓글 추가 함수
  const addComment = () => {
    if (commentInput.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentInput.trim(),
        timestamp: new Date().toISOString()
      };
      setComments([newComment, ...comments]);
      setCommentInput('');
    }
  };

  // 엔터키 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  // 표시할 댓글 목록
  const displayedComments = showAllComments 
    ? comments 
    : comments.slice(0, 5);

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

      <style>
  {`
    @media (max-width: 600px) {
      .test-version-comment {
        white-space: pre-line !important; /* 모바일에서도 줄바꿈 적용 */
        text-align: right !important; /* 우측 정렬 유지 */
      }
    }
  `}
</style>

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
            placeholder="코멘트를 입력하세요 (엔터키로 등록)"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          
          <div style={commentListStyle}>
            {displayedComments.map((comment) => (
              <div key={comment.id} style={commentItemStyle}>
                <div>{comment.text}</div>
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
          
          {comments.length > 5 && (
            <button 
              style={showMoreButtonStyle} 
              onClick={() => setShowAllComments(!showAllComments)}
            >
              {showAllComments ? '접기' : '더보기'}
            </button>
          )}
        </div>
      </div>

      {/* 3. 산행 정보 */}
      <div style={commentSectionStyle} className="comment-section">
        <div style={{ position: 'relative' }}>
          {/* 우천취소 표시 */}
          
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
            D조 단기산행
          </div>
          

          {/* 기존 산행 정보 */}
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

      {/* 4. 하단 버튼 */}
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
