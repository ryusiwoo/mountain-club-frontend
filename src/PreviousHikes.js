// src/PreviousHikes.js
import React, { useState } from 'react';
import { hikes } from './hikesData';

function PreviousHikes() {
  const [selected, setSelected] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // 확대된 이미지를 보여줄 상태 추가

  // 폴더로 이동 함수
  const goToFolder = (url) => {
    window.open(url, '_blank');
  };

  // 사진 클릭 및 호버 효과 추가
  const handlePhotoClick = (url) => {
    if (window.innerWidth <= 768) {
      // 모바일 환경에서 클릭 시 확대된 이미지를 보여줌
      setSelectedImage(url);
    }
  };

  const handleMouseEnter = (e) => {
    if (window.innerWidth > 768) { // PC 환경에서만 호버 효과 적용
      e.target.style.transform = 'scale(2.5)'; // 사진을 더 크게 확대
      e.target.style.boxShadow = '0 12px 36px rgba(0,0,0,0.2)';
      e.target.style.zIndex = '10';
    }
  };

  const handleMouseLeave = (e) => {
    if (window.innerWidth > 768) {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = 'none';
      e.target.style.zIndex = '0';
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>이전 산행 목록</h2>
      <div style={cardListStyle}>
        {hikes.map(hike => (
          <div key={hike.id} style={cardStyle} onClick={() => setSelected(hike)}>
            <img src={hike.photos[0]} alt="썸네일" style={thumbStyle} />
            <div style={cardInfoStyle}>
              <div style={cardTitleStyle}>{hike.date} {hike.location}</div>
              <div style={cardSubStyle}>{hike.comment}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      {selected && (
        <div style={modalOverlayStyle} onClick={() => setSelected(null)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <span style={modalTitleStyle}>{selected.date} {selected.location}</span>
              <button style={closeBtnStyle} onClick={() => setSelected(null)}>닫기</button>
            </div>
            <div style={modalInfoStyle}>
              <span>👥 {selected.participants}명</span>
              <span>🗺️ {selected.distance}</span>
              <span>⛰️ {selected.difficulty}</span>
            </div>
            <div style={modalCommentStyle}>{selected.comment}</div>
            <div style={modalPhotoListStyle}>
              {selected.photos.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="산행사진"
                  style={modalPhotoStyle}
                  onClick={() => handlePhotoClick(url)} // 모바일 클릭 시 확대
                  onMouseEnter={handleMouseEnter} // PC 호버 효과
                  onMouseLeave={handleMouseLeave} // PC 호버 해제
                />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <button
                style={{
                  background: '#4f8cff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => goToFolder(selected.folderUrl)}
              >
                더 많은 사진 보기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확대된 이미지 모달 추가 */}
      {selectedImage && (
        <div style={modalOverlayStyle} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="확대된 사진" style={modalImageStyle} />
        </div>
      )}
    </div>
  );
}

// 스타일 정의
const containerStyle = { padding: '10px 0', width: '100%', maxWidth: 500, margin: '0 auto' };
const titleStyle = { fontSize: '1.2rem', fontWeight: 700, margin: '10px 0 18px 12px', color: '#2d3a4b' };
const cardListStyle = { display: 'flex', flexDirection: 'column', gap: 14 };
const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  cursor: 'pointer',
  padding: 10,
  gap: 12
};
const thumbStyle = { width: 70, height: 70, borderRadius: 8, objectFit: 'cover', flexShrink: 0 };
const cardInfoStyle = { display: 'flex', flexDirection: 'column', gap: 4 };
const cardTitleStyle = { fontWeight: 600, fontSize: '1rem', color: '#222' };
const cardSubStyle = { fontSize: '0.92rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 };

// 모달 스타일
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
  background: '#fff', borderRadius: 14, padding: 18, width: '90vw', maxWidth: 380, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.13)'
};
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 };
const modalTitleStyle = { fontWeight: 700, fontSize: '1.1rem', color: '#2d3a4b' };
const closeBtnStyle = { background: '#eee', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 };
const modalInfoStyle = { display: 'flex', gap: 12, fontSize: '0.95rem', color: '#444', margin: '8px 0 10px 0' };
const modalCommentStyle = { fontSize: '0.95rem', color: '#555', marginBottom: 10 };
const modalPhotoListStyle = { display: 'flex', gap: 8, flexWrap: 'wrap' };
const modalPhotoStyle = {
  width: 90,
  height: 90,
  borderRadius: 8,
  objectFit: 'cover',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};
const modalImageStyle = {
  maxWidth: '90%',
  maxHeight: '90vh',
  objectFit: 'contain',
  borderRadius: 8,
};

export default PreviousHikes;