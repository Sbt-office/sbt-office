const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">페이지를 찾을 수 없습니다</p>
      <a 
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        tabIndex={0}
        aria-label="메인 페이지로 이동"
      >
        메인 페이지로 이동
      </a>
    </div>
  );
};

export default NotFound; 