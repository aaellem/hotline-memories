import React from 'react';
export default function DebugBanner(){
  return (
    <div style={{position:'fixed',bottom:8,right:8,background:'#004f5d',color:'#fff',padding:'6px 10px',borderRadius:8,fontSize:12,zIndex:9999}}>
      v4_6 running
    </div>
  );
}