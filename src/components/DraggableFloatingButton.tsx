import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Settings } from 'lucide-react';

interface DraggableFloatingButtonProps {
  onClick: () => void;
}

const DraggableFloatingButton: React.FC<DraggableFloatingButtonProps> = ({ onClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<number>();

  // 初始化位置 - 右侧中间偏下
  useEffect(() => {
    const updatePosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const buttonWidth = 70; // 按钮宽度（包含图标和文字）
      
      setPosition({
        x: screenWidth - buttonWidth - 16, // 右侧边缘，留16px间距
        y: screenHeight * 0.6 // 屏幕60%高度位置
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // 计算边界约束
  const getConstrainedPosition = useCallback((x: number, y: number) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const buttonWidth = 70; // 按钮宽度
    const buttonHeight = 36; // 按钮高度
    const margin = 8;

    return {
      x: Math.max(margin, Math.min(screenWidth - buttonWidth - margin, x)),
      y: Math.max(margin, Math.min(screenHeight - buttonHeight - margin - 80, y)) // 80px为底部菜单高度
    };
  }, []);

  // 自动吸附到右侧
  const snapToRightEdge = useCallback(() => {
    const screenWidth = window.innerWidth;
    const buttonWidth = 70;
    const margin = 16;
    
    setIsAnimating(true);
    setPosition(prev => ({
      x: screenWidth - buttonWidth - margin,
      y: prev.y
    }));

    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });

    // 清除可能存在的点击超时
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = getConstrainedPosition(
      e.clientX - dragStart.x,
      e.clientY - dragStart.y
    );
    setPosition(newPosition);
  }, [isDragging, dragStart, getConstrainedPosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      snapToRightEdge();
    }
  }, [isDragging, snapToRightEdge]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });

    // 清除可能存在的点击超时
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const newPosition = getConstrainedPosition(
      touch.clientX - dragStart.x,
      touch.clientY - dragStart.y
    );
    setPosition(newPosition);
  }, [isDragging, dragStart, getConstrainedPosition]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      snapToRightEdge();
    }
  }, [isDragging, snapToRightEdge]);

  // 点击事件处理 - 只有在没有拖拽时才触发
  const handleClick = () => {
    if (!isDragging) {
      // 延迟执行点击，确保不是拖拽操作
      dragTimeoutRef.current = setTimeout(() => {
        onClick();
      }, 50);
    }
  };

  // 绑定全局事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // 清理超时
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={buttonRef}
      className={`
        fixed z-50 bg-blue-500 hover:bg-blue-600 text-white 
        rounded-l-full rounded-r-lg shadow-lg flex items-center space-x-2 cursor-pointer
        select-none touch-none px-3 py-1.5
        ${isDragging ? 'scale-110 shadow-xl' : 'hover:scale-105'}
        ${isAnimating ? 'transition-all duration-300 ease-out' : ''}
        ${isDragging ? '' : 'transition-transform duration-200'}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <Settings className="w-4 h-4" />
      <span className="text-xs font-medium">设置</span>
    </div>
  );
};

export default DraggableFloatingButton;