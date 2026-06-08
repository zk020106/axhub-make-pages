import React, { useState, useMemo } from 'react';
import { Menu, Bell, User, Clock, ChevronLeft, ChevronRight, Building2, Camera, Truck, AlertTriangle, TrendingUp, Eye, Play, Pause, Volume2, Maximize, Search, Filter, Download, ArrowLeft, MapPin, Calendar, LayoutDashboard, FileText, Video, Settings } from 'lucide-react';
import './tw.css';
import { PrototypeAnnotation } from './components/PrototypeAnnotation';
import { AnnotationViewer } from '@axhub/annotation';
import type { AnnotationDirectoryRouteNode, AnnotationSourceDocument, AnnotationViewerOptions } from '@axhub/annotation';
import annotationSourceDocument from './annotation-source.json';

// 路由管理
type PageType =
  | 'dashboard'
  | 'source-control'
  | 'enterprise-detail'
  | 'plate-analysis'
  | 'plate-detail'
  | 'report'
  | 'report-preview'
  | 'data-query'
  | 'video-patrol'
  | 'blacklist'
  | 'blacklist-detail'
  | 'basic-info';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新时间
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  };

  // 菜单项 - 使用专业图标
  const menuItems = [
    { id: 'dashboard', label: '首页驾驶舱', icon: LayoutDashboard },
    { id: 'source-control', label: '源头管控', icon: Building2 },
    { id: 'plate-analysis', label: '遮挡研判', icon: Eye },
    { id: 'report', label: '治超报告', icon: FileText },
    { id: 'data-query', label: '数据查询', icon: Search },
    { id: 'video-patrol', label: '视频巡查', icon: Video },
    { id: 'blacklist', label: '黑名单管理', icon: AlertTriangle },
    { id: 'basic-info', label: '基础信息管理', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'source-control':
        return <SourceControlPage onNavigate={setCurrentPage} />;
      case 'enterprise-detail':
        return <EnterpriseDetailPage onNavigate={setCurrentPage} />;
      case 'plate-analysis':
        return <PlateAnalysisPage onNavigate={setCurrentPage} />;
      case 'plate-detail':
        return <PlateDetailPage onNavigate={setCurrentPage} />;
      case 'report':
        return <ReportPage onNavigate={setCurrentPage} />;
      case 'report-preview':
        return <ReportPreviewPage onNavigate={setCurrentPage} />;
      case 'data-query':
        return <DataQueryPage onNavigate={setCurrentPage} />;
      case 'video-patrol':
        return <VideoPatrolPage onNavigate={setCurrentPage} />;
      case 'blacklist':
        return <BlacklistPage onNavigate={setCurrentPage} />;
      case 'blacklist-detail':
        return <BlacklistDetailPage onNavigate={setCurrentPage} />;
      case 'basic-info':
        return <BasicInfoPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  const annotationOptions = useMemo<AnnotationViewerOptions>(() => ({
    showToolbar: true,
    showThemeToggle: true,
    showColorFilter: true,
    emptyWhenNoData: false,
    toolbarEdge: 'right',
    currentPageId: currentPage,
    onDirectoryRoute: (node: AnnotationDirectoryRouteNode) => {
      if (typeof node.route === 'string') {
        setCurrentPage(node.route as PageType);
      }
    },
  }), [currentPage]);

  return (
    <div className="flex h-screen bg-white">
      {/* 左侧菜单 */}
      <aside
        className={`bg-white border-r border-[#dee1e6] transition-all duration-200 flex flex-col ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-3.5 border-b border-[#dee1e6] min-h-[64px]">
          {!sidebarCollapsed && (
            <span className="text-xs font-medium text-[#5b616e] uppercase tracking-wide">系统菜单</span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-[#eef0f3] rounded transition-colors"
            aria-label={sidebarCollapsed ? '展开菜单' : '收起菜单'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} className="text-[#5b616e]" /> : <ChevronLeft size={16} className="text-[#5b616e]" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as PageType)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-[#f0f6ff] text-[#0052ff] border-r-2 border-[#0052ff]'
                    : 'text-[#0a0b0d] hover:bg-[#f7f7f7]'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} className={isActive ? 'text-[#0052ff]' : 'text-[#5b616e]'} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-[#dee1e6] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-[#0a0b0d]">
              新余交通治超综合监管平台
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#5b616e] font-mono">
              <Clock size={14} />
              <span>{formatTime(currentTime)}</span>
            </div>

            <button
              className="relative p-1.5 hover:bg-[#eef0f3] rounded transition-colors"
              aria-label="通知"
            >
              <Bell size={18} className="text-[#5b616e]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#cf202f] rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-[#dee1e6]">
              <div className="w-7 h-7 bg-[#eef0f3] rounded-full flex items-center justify-center">
                <User size={14} className="text-[#5b616e]" />
              </div>
              <span className="text-sm text-[#0a0b0d]">管理员</span>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto bg-[#f7f7f7]">
          {renderPage()}
        </main>
      </div>

      <AnnotationViewer
        source={annotationSourceDocument as AnnotationSourceDocument}
        options={annotationOptions}
      />
    </div>
  );
};

// ========== 页面组件占位 ==========

const DashboardPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const stats = [
    { label: '重点企业数量', value: '15', unit: '家', icon: Building2, color: 'primary' },
    { label: '接入摄像头数量', value: '128', unit: '个', icon: Camera, color: 'primary' },
    { label: '今日货车通行量', value: '2,847', unit: '辆', icon: Truck, color: 'neutral' },
    { label: '超限车辆数量', value: '43', unit: '辆', icon: AlertTriangle, color: 'warning' },
    { label: '黑名单预警数量', value: '8', unit: '次', icon: AlertTriangle, color: 'danger' },
    { label: '遮挡号牌研判数量', value: '12', unit: '个', icon: Eye, color: 'warning' },
  ];

  const recentAlerts = [
    { time: '14:23:15', type: '超限预警', vehicle: '赣K12345', location: '渝水区检测点', status: '待处理' },
    { time: '14:18:42', type: '黑名单预警', vehicle: '赣K67890', location: '仙女湖检测点', status: '处理中' },
    { time: '14:12:30', type: '遮挡号牌', vehicle: '未识别', location: '分宜县检测点', status: '待处理' },
    { time: '13:58:16', type: '超限预警', vehicle: '赣K23456', location: '渝水区检测点', status: '已完成' },
    { time: '13:45:03', type: '黑名单预警', vehicle: '赣K78901', location: '高新区检测点', status: '已完成' },
  ];

  const topEnterprises = [
    { name: '新余市建材运输有限公司', violations: 8, trend: 'up' },
    { name: '新钢物流有限责任公司', violations: 6, trend: 'down' },
    { name: '江西众腾物流有限公司', violations: 5, trend: 'up' },
    { name: '新余市恒通货运公司', violations: 4, trend: 'same' },
    { name: '渝水区鑫盛运输队', violations: 3, trend: 'down' },
  ];

  return (
    <div className="p-5 max-w-[1600px] mx-auto">
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-5" data-annotation-id="dashboard-stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorMap = {
            primary: { bg: 'bg-[#f0f6ff]', border: 'border-[#0052ff]/20', icon: 'text-[#0052ff]', text: 'text-[#0052ff]' },
            neutral: { bg: 'bg-[#f7f7f7]', border: 'border-[#dee1e6]', icon: 'text-[#5b616e]', text: 'text-[#0a0b0d]' },
            warning: { bg: 'bg-[#fff9e6]', border: 'border-[#f4b000]/20', icon: 'text-[#f4b000]', text: 'text-[#f4b000]' },
            danger: { bg: 'bg-[#fff0f0]', border: 'border-[#cf202f]/20', icon: 'text-[#cf202f]', text: 'text-[#cf202f]' },
          };
          const colorConfig = colorMap[stat.color as keyof typeof colorMap];

          return (
            <div
              key={index}
              className={`${colorConfig.bg} border ${colorConfig.border} rounded-xl p-4 transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-slate-600">{stat.label}</span>
                <Icon className={`${colorConfig.icon}`} size={18} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-semibold ${colorConfig.text} tabular-nums`}>{stat.value}</span>
                <span className="text-sm text-slate-500">{stat.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* 实时预警 */}
        <div className="bg-white border border-[#dee1e6] rounded-xl" data-annotation-id="alert-list">
          <div className="px-4 py-3 border-b border-[#dee1e6]">
            <h3 className="text-sm font-semibold text-[#0a0b0d]">实时预警</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2.5">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between py-2.5 border-b border-[#eef0f3] last:border-0 hover:bg-[#f7f7f7] -mx-2 px-2 rounded-lg transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        alert.type === '超限预警' ? 'bg-[#fff9e6] text-[#f4b000]' :
                        alert.type === '黑名单预警' ? 'bg-[#fff0f0] text-[#cf202f]' :
                        'bg-[#fff9e6] text-[#f4b000]'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-sm font-medium text-[#0a0b0d] font-mono">{alert.vehicle}</span>
                    </div>
                    <div className="text-xs text-[#5b616e]">{alert.location}</div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-xs text-[#5b616e] mb-1 font-mono tabular-nums">{alert.time}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      alert.status === '待处理' ? 'bg-[#f7f7f7] text-[#5b616e]' :
                      alert.status === '处理中' ? 'bg-[#f0f6ff] text-[#0052ff]' :
                      'bg-[#e6f7f0] text-[#05b169]'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 企业违法排行 */}
        <div className="bg-white border border-[#dee1e6] rounded-xl" data-annotation-id="enterprise-ranking">
          <div className="px-4 py-3 border-b border-[#dee1e6]">
            <h3 className="text-sm font-semibold text-[#0a0b0d]">企业违法排行（本月）</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {topEnterprises.map((enterprise, index) => (
                <div key={index} className="flex items-center gap-3 hover:bg-[#f7f7f7] -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold ${
                    index === 0 ? 'bg-[#fff0f0] text-[#cf202f]' :
                    index === 1 ? 'bg-[#fff9e6] text-[#f4b000]' :
                    index === 2 ? 'bg-[#fff9e6] text-[#f4b000]' :
                    'bg-[#f7f7f7] text-[#5b616e]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#0a0b0d] mb-0.5 truncate">{enterprise.name}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#5b616e]">违法次数:</span>
                      <span className="text-xs font-semibold text-[#cf202f] tabular-nums">{enterprise.violations}</span>
                      {enterprise.trend === 'up' && <TrendingUp size={12} className="text-[#cf202f]" />}
                      {enterprise.trend === 'down' && <TrendingUp size={12} className="text-[#05b169] rotate-180" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="mt-5 grid grid-cols-4 gap-4">
        {[
          { label: '源头管控', page: 'source-control', icon: Building2 },
          { label: '遮挡研判', page: 'plate-analysis', icon: Eye },
          { label: '视频巡查', page: 'video-patrol', icon: Video },
          { label: '黑名单管理', page: 'blacklist', icon: AlertTriangle },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onNavigate(item.page as PageType)}
              className="bg-white border border-[#dee1e6] rounded-xl p-4 hover:border-[#0052ff] hover:shadow-sm transition-all text-left group"
            >
              <Icon className="text-[#5b616e] group-hover:text-[#0052ff] mb-2 transition-colors" size={20} />
              <div className="text-sm font-medium text-[#0a0b0d]">{item.label}</div>
            </button>
          );
        })}
      </div>

      <PrototypeAnnotation
        pageName="首页驾驶舱"
        pageDescription="展示新余交通治超综合监管平台的核心数据指标和实时预警信息，为管理人员提供全局监控视图。"
        interactions={[
          {
            element: '核心指标卡片',
            action: '点击卡片',
            result: '进入对应功能详情页（如点击"重点企业数量"进入源头管控页面）'
          },
          {
            element: '实时预警列表项',
            action: '点击预警记录',
            result: '跳转到对应的详情页面（如遮挡研判详情、黑名单详情）'
          },
          {
            element: '快捷入口卡片',
            action: '点击卡片',
            result: '快速进入对应功能模块'
          }
        ]}
        states={[
          {
            name: '预警状态',
            description: '待处理（灰色）、处理中（蓝色）、已完成（绿色）'
          },
          {
            name: '预警类型',
            description: '超限预警（黄色）、黑名单预警（红色）、遮挡号牌（黄色）'
          }
        ]}
        notes={[
          '数据每30秒自动刷新一次',
          '右上角显示当前系统时间',
          '核心指标采用 Coinbase Blue 作为主色调',
          '企业违法排行按本月违法次数降序排列'
        ]}
      />
    </div>
  );
};

const SourceControlPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const enterprises = [
    { id: 1, name: '新余市建材运输有限公司', contact: '张经理', phone: '13907905001', address: '渝水区仙来大道128号', cameras: 8, todayIn: 45, todayOut: 42, abnormal: 3 },
    { id: 2, name: '新钢物流有限责任公司', contact: '李经理', phone: '13907905002', address: '渝水区劳动北路518号', cameras: 12, todayIn: 68, todayOut: 65, abnormal: 2 },
    { id: 3, name: '江西众腾物流有限公司', contact: '王经理', phone: '13907905003', address: '高新区春龙大道88号', cameras: 6, todayIn: 32, todayOut: 30, abnormal: 1 },
    { id: 4, name: '新余市恒通货运公司', contact: '赵经理', phone: '13907905004', address: '渝水区袁河大道268号', cameras: 5, todayIn: 28, todayOut: 27, abnormal: 0 },
    { id: 5, name: '渝水区鑫盛运输队', contact: '刘经理', phone: '13907905005', address: '渝水区胜利南路156号', cameras: 4, todayIn: 18, todayOut: 18, abnormal: 0 },
    { id: 6, name: '新余市运通物流配送中心', contact: '陈经理', phone: '13907905006', address: '仙女湖区河下镇工业园', cameras: 10, todayIn: 52, todayOut: 50, abnormal: 4 },
    { id: 7, name: '分宜县昌盛货运有限公司', contact: '周经理', phone: '13907905007', address: '分宜县钤山东路298号', cameras: 7, todayIn: 38, todayOut: 36, abnormal: 1 },
    { id: 8, name: '新余市利达物流有限公司', contact: '吴经理', phone: '13907905008', address: '渝水区城北物流园', cameras: 9, todayIn: 56, todayOut: 54, abnormal: 2 },
  ];

  return (
    <div className="p-5 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#0a0b0d]">源头管控</h2>
        <p className="text-xs text-[#5b616e] mt-0.5">监管新余市重点企业车辆运输情况</p>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl border border-[#dee1e6] p-3 mb-4" data-annotation-id="search-bar">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#a8acb3]" size={16} />
            <input
              type="text"
              placeholder="搜索企业名称、联系人、联系电话..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#dee1e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 text-sm bg-[#0052ff] text-white rounded-full hover:bg-[#003ecc] transition-colors flex items-center gap-1.5 font-medium">
            <Search size={14} />
            查询
          </button>
          <button className="px-4 py-2 text-sm border border-[#dee1e6] rounded-full hover:bg-[#eef0f3] transition-colors flex items-center gap-1.5 font-medium">
            <Filter size={14} />
            筛选
          </button>
        </div>
      </div>

      {/* 企业卡片网格 */}
      <div className="grid grid-cols-2 gap-4">
        {enterprises.map(enterprise => (
          <div
            key={enterprise.id}
            onClick={() => onNavigate('enterprise-detail')}
            className="bg-white rounded-xl border border-[#dee1e6] p-4 hover:shadow-md hover:border-[#0052ff] transition-all cursor-pointer"
            data-annotation-id="enterprise-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#0a0b0d] mb-1.5 truncate">{enterprise.name}</h3>
                <div className="space-y-0.5 text-xs text-[#5b616e]">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-[#a8acb3] flex-shrink-0" />
                    <span>{enterprise.contact}</span>
                    <span className="text-[#dee1e6]">|</span>
                    <span className="font-mono">{enterprise.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#a8acb3] flex-shrink-0" />
                    <span className="truncate">{enterprise.address}</span>
                  </div>
                </div>
              </div>
              {enterprise.abnormal > 0 && (
                <span className="px-2 py-0.5 bg-[#fff0f0] text-[#cf202f] text-xs font-medium rounded-full whitespace-nowrap ml-2">
                  {enterprise.abnormal} 异常
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3 pt-3 border-t border-[#eef0f3]">
              <div>
                <div className="text-xs text-[#5b616e] mb-0.5">接入摄像头</div>
                <div className="text-base font-semibold text-[#0a0b0d] tabular-nums">{enterprise.cameras}</div>
              </div>
              <div>
                <div className="text-xs text-[#5b616e] mb-0.5">今日进场</div>
                <div className="text-base font-semibold text-[#0052ff] tabular-nums">{enterprise.todayIn}</div>
              </div>
              <div>
                <div className="text-xs text-[#5b616e] mb-0.5">今日出场</div>
                <div className="text-base font-semibold text-[#0052ff] tabular-nums">{enterprise.todayOut}</div>
              </div>
              <div>
                <div className="text-xs text-[#5b616e] mb-0.5">异常车辆</div>
                <div className={`text-base font-semibold tabular-nums ${enterprise.abnormal > 0 ? 'text-[#cf202f]' : 'text-[#a8acb3]'}`}>
                  {enterprise.abnormal}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PrototypeAnnotation
        pageName="源头管控 - 企业列表"
        pageDescription="展示新余市所有重点货运企业的基本信息和实时监控数据，便于执法人员快速定位异常企业。"
        interactions={[
          {
            element: '搜索框',
            action: '输入关键词并点击查询',
            result: '筛选匹配的企业列表'
          },
          {
            element: '企业卡片',
            action: '点击任意企业卡片',
            result: '进入该企业的详情页面，查看车辆进出记录'
          },
          {
            element: '筛选按钮',
            action: '点击筛选',
            result: '展开高级筛选条件（区域、异常状态等）'
          }
        ]}
        states={[
          {
            name: '异常状态',
            description: '有异常车辆的企业右上角显示红色"N 异常"标签'
          },
          {
            name: '数据指标',
            description: '今日进场/出场使用蓝色，异常车辆使用红色'
          }
        ]}
        notes={[
          '企业卡片采用网格布局，每行2个',
          '异常企业优先排序显示',
          '搜索支持企业名称、联系人、电话模糊匹配',
          '数据指标实时更新，每分钟刷新一次'
        ]}
      />
    </div>
  );
};

const EnterpriseDetailPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const vehicleRecords = [
    { id: 1, plate: '赣K12345', brand: '解放', color: '蓝色', inTime: '2026-06-08 08:23:15', outTime: '2026-06-08 09:45:32', status: '正常' },
    { id: 2, plate: '赣K23456', brand: '东风', color: '红色', inTime: '2026-06-08 09:12:08', outTime: '2026-06-08 10:38:21', status: '超限' },
    { id: 3, plate: '赣K34567', brand: '重汽', color: '白色', inTime: '2026-06-08 10:05:42', outTime: '2026-06-08 11:22:15', status: '正常' },
    { id: 4, plate: '赣K45678', brand: '陕汽', color: '蓝色', inTime: '2026-06-08 11:18:33', outTime: '2026-06-08 12:45:08', status: '正常' },
    { id: 5, plate: '赣K56789', brand: '解放', color: '绿色', inTime: '2026-06-08 13:25:16', outTime: '2026-06-08 14:18:42', status: '超限' },
    { id: 6, plate: '赣K67890', brand: '福田', color: '蓝色', inTime: '2026-06-08 14:32:58', outTime: '', status: '在场' },
  ];

  return (
    <div className="p-5 max-w-[1600px] mx-auto">
      {/* 返回按钮 */}
      <button
        onClick={() => onNavigate('source-control')}
        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 mb-4 transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        返回企业列表
      </button>

      {/* 企业基本信息 */}
      <div className="bg-white rounded-xl border border-[#dee1e6] p-4 mb-4" data-annotation-id="enterprise-info">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-[#0a0b0d] mb-1.5">新余市建材运输有限公司</h2>
            <div className="flex items-center gap-3 text-xs text-[#5b616e]">
              <span className="flex items-center gap-1">
                <User size={12} />
                联系人: 张经理
              </span>
              <span>电话: 13907905001</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                渝水区仙来大道128号
              </span>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#e6f7f0] text-[#05b169] text-xs font-medium rounded-full">
            正常运营
          </span>
        </div>

        <div className="grid grid-cols-6 gap-3 pt-3 border-t border-[#eef0f3]">
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#0a0b0d] tabular-nums">8</div>
            <div className="text-xs text-[#5b616e] mt-0.5">接入摄像头</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#0052ff] tabular-nums">45</div>
            <div className="text-xs text-[#5b616e] mt-0.5">今日进场</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#0052ff] tabular-nums">42</div>
            <div className="text-xs text-[#5b616e] mt-0.5">今日出场</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#5b616e] tabular-nums">3</div>
            <div className="text-xs text-[#5b616e] mt-0.5">当前在场</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#cf202f] tabular-nums">3</div>
            <div className="text-xs text-[#5b616e] mt-0.5">异常车辆</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[#0a0b0d] tabular-nums">1,248</div>
            <div className="text-xs text-[#5b616e] mt-0.5">本月通行</div>
          </div>
        </div>
      </div>

      {/* 车辆出入记录 */}
      <div className="bg-white rounded-xl border border-[#dee1e6]" data-annotation-id="vehicle-records-table">
        <div className="px-4 py-3 border-b border-[#dee1e6]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0a0b0d]">车辆出入记录</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="搜索车牌号..."
                className="px-3 py-1.5 text-xs border border-[#dee1e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052ff]"
              />
              <button className="px-3 py-1.5 text-xs border border-[#dee1e6] rounded-lg hover:bg-[#eef0f3] transition-colors flex items-center gap-1">
                <Filter size={12} />
                筛选
              </button>
              <button className="px-3 py-1.5 text-xs bg-[#0052ff] text-white rounded-lg hover:bg-[#003ecc] transition-colors flex items-center gap-1 font-medium">
                <Download size={12} />
                导出
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f7f7] border-b border-[#dee1e6]">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">车牌号码</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">车辆品牌</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">车身颜色</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">进场时间</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">出场时间</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">运输状态</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#5b616e]">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#eef0f3]">
              {vehicleRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#f7f7f7] transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-[#0a0b0d]">{record.plate}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#5b616e]">{record.brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#5b616e]">{record.color}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#5b616e] font-mono tabular-nums">{record.inTime}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[#5b616e] font-mono tabular-nums">
                    {record.outTime || <span className="text-[#a8acb3]">-</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      record.status === '正常' ? 'bg-[#e6f7f0] text-[#05b169]' :
                      record.status === '超限' ? 'bg-[#fff0f0] text-[#cf202f]' :
                      'bg-[#e6f7f0] text-[#05b169]'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <button className="text-[#0052ff] hover:text-[#003ecc] transition-colors font-medium">查看详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-4 py-3 border-t border-[#dee1e6] flex items-center justify-between text-xs">
          <div className="text-[#5b616e]">
            共 156 条记录，当前第 1/16 页
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-[#dee1e6] rounded-lg hover:bg-[#eef0f3] transition-colors">上一页</button>
            <button className="px-3 py-1.5 bg-[#0052ff] text-white rounded-lg font-medium">1</button>
            <button className="px-3 py-1.5 border border-[#dee1e6] rounded-lg hover:bg-[#eef0f3] transition-colors">2</button>
            <button className="px-3 py-1.5 border border-[#dee1e6] rounded-lg hover:bg-[#eef0f3] transition-colors">3</button>
            <button className="px-3 py-1.5 border border-[#dee1e6] rounded-lg hover:bg-[#eef0f3] transition-colors">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlateAnalysisPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const alerts = [
    { id: 1, location: '渝水区检测点', time: '2026-06-08 14:23:15', matchRate: 95, suspectedPlate: '赣K12345', status: '待处理' },
    { id: 2, location: '仙女湖检测点', time: '2026-06-08 14:18:42', matchRate: 92, suspectedPlate: '赣K67890', status: '处理中' },
    { id: 3, location: '分宜县检测点', time: '2026-06-08 14:12:30', matchRate: 88, suspectedPlate: '赣K23456', status: '待处理' },
    { id: 4, location: '高新区检测点', time: '2026-06-08 13:58:16', matchRate: 94, suspectedPlate: '赣K78901', status: '已确认' },
    { id: 5, location: '渝水区检测点', time: '2026-06-08 13:45:03', matchRate: 91, suspectedPlate: '赣K34567', status: '已确认' },
    { id: 6, location: '仙女湖检测点', time: '2026-06-08 13:32:48', matchRate: 87, suspectedPlate: '赣K89012', status: '误报' },
    { id: 7, location: '分宜县检测点', time: '2026-06-08 13:15:22', matchRate: 96, suspectedPlate: '赣K45678', status: '已确认' },
    { id: 8, location: '高新区检测点', time: '2026-06-08 12:58:35', matchRate: 89, suspectedPlate: '赣K56789', status: '待处理' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">遮挡研判</h2>
        <p className="text-sm text-gray-600 mt-1">识别和研判遮挡号牌车辆</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '今日触发', value: '32', color: 'blue' },
          { label: '待处理', value: '8', color: 'yellow' },
          { label: '处理中', value: '3', color: 'purple' },
          { label: '已确认', value: '21', color: 'green' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-semibold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">治超点位</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部点位</option>
              <option>渝水区检测点</option>
              <option>仙女湖检测点</option>
              <option>分宜县检测点</option>
              <option>高新区检测点</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">处理状态</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部状态</option>
              <option>待处理</option>
              <option>处理中</option>
              <option>已确认</option>
              <option>误报</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">匹配度</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部</option>
              <option>≥90%</option>
              <option>85%-90%</option>
              <option>&lt;85%</option>
            </select>
          </div>
          <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Search size={14} />
            查询
          </button>
          <button className="px-4 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Filter size={14} />
            重置
          </button>
        </div>
      </div>

      {/* 预警列表 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">遮挡号牌预警列表</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1">
              <Download size={14} />
              导出
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">序号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">治超点名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">触发时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">匹配度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">疑似车牌</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">处理状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert, index) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alert.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                        <div
                          className={`h-2 rounded-full ${
                            alert.matchRate >= 90 ? 'bg-green-500' :
                            alert.matchRate >= 85 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${alert.matchRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{alert.matchRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-semibold text-gray-900">{alert.suspectedPlate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      alert.status === '待处理' ? 'bg-yellow-100 text-yellow-700' :
                      alert.status === '处理中' ? 'bg-blue-100 text-blue-700' :
                      alert.status === '已确认' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onNavigate('plate-detail')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 32 条记录，当前第 1/4 页
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlateDetailPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const matchedVehicles = [
    { time: '2026-06-08 10:23:15', plate: '赣K12345', matchRate: 95, location: '渝水区检测点', image: true },
    { time: '2026-06-07 15:42:08', plate: '赣K12345', matchRate: 93, location: '仙女湖检测点', image: true },
    { time: '2026-06-06 09:15:33', plate: '赣K12345', matchRate: 91, location: '高新区检测点', image: true },
  ];

  return (
    <div className="p-6">
      {/* 返回按钮 */}
      <button
        onClick={() => onNavigate('plate-analysis')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        返回遮挡研判列表
      </button>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">遮挡号牌研判详情</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>触发时间: 2026-06-08 14:23:15</span>
              <span>治超点: 渝水区检测点</span>
              <span>摄像头编号: CAM-001</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg">
            待处理
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">匹配度</div>
            <div className="text-2xl font-semibold text-green-600">95%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">疑似车牌</div>
            <div className="text-lg font-mono font-semibold text-gray-900">赣K12345</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">车辆颜色</div>
            <div className="text-lg font-semibold text-gray-900">蓝色</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">车辆品牌</div>
            <div className="text-lg font-semibold text-gray-900">解放</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 遮挡车辆图片 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">遮挡号牌车辆</h3>
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <Camera className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-sm text-gray-500">遮挡号牌车辆图片</p>
              <p className="text-xs text-gray-400 mt-1">2026-06-08 14:23:15</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 rounded aspect-video flex items-center justify-center">
              <p className="text-xs text-gray-400">特写1</p>
            </div>
            <div className="bg-gray-100 rounded aspect-video flex items-center justify-center">
              <p className="text-xs text-gray-400">特写2</p>
            </div>
          </div>
        </div>

        {/* 匹配车辆信息 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">匹配车辆信息</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">车牌号码</span>
              <span className="text-sm font-mono font-semibold text-gray-900">赣K12345</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">车辆品牌</span>
              <span className="text-sm font-semibold text-gray-900">解放</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">车身颜色</span>
              <span className="text-sm font-semibold text-gray-900">蓝色</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">车辆类型</span>
              <span className="text-sm font-semibold text-gray-900">重型货车</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">车辆轴数</span>
              <span className="text-sm font-semibold text-gray-900">6轴</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">所属企业</span>
              <span className="text-sm font-semibold text-gray-900">新余市建材运输有限公司</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">匹配度</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                </div>
                <span className="text-sm font-semibold text-green-600">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 历史匹配记录 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">历史匹配记录</h3>
        <div className="space-y-4">
          {matchedVehicles.map((vehicle, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="bg-gray-100 rounded w-32 h-20 flex items-center justify-center flex-shrink-0">
                <Camera className="text-gray-400" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-semibold text-gray-900">{vehicle.plate}</span>
                  <span className="text-sm text-gray-600">{vehicle.time}</span>
                </div>
                <div className="text-sm text-gray-600">{vehicle.location}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">匹配度</div>
                <div className="text-lg font-semibold text-green-600">{vehicle.matchRate}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-6 flex gap-2 justify-end">
        <button className="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
          标记为误报
        </button>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          确认车牌信息
        </button>
      </div>
    </div>
  );
};

const ReportPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const reports = [
    { id: 1, name: '2026年5月治超月报', type: '月度报告', period: '2026-05', createTime: '2026-06-01 09:00:00', creator: '张三', status: '已生成' },
    { id: 2, name: '2026年第一季度治超季报', type: '季度报告', period: '2026-Q1', createTime: '2026-04-05 10:30:00', creator: '李四', status: '已生成' },
    { id: 3, name: '2026年4月治超月报', type: '月度报告', period: '2026-04', createTime: '2026-05-01 09:15:00', creator: '王五', status: '已生成' },
    { id: 4, name: '2025年度治超年报', type: '年度报告', period: '2025', createTime: '2026-01-10 14:20:00', creator: '赵六', status: '已生成' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">治超报告</h2>
        <p className="text-sm text-gray-600 mt-1">生成和查看各类治超统计报告</p>
      </div>

      {/* 报告生成配置 */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">生成新报告</h3>
          <button
            onClick={() => onNavigate('report-preview')}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            生成报告
          </button>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">报告类型</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>月度报告</option>
              <option>季度报告</option>
              <option>半年报告</option>
              <option>年度报告</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">报告年份</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">报告周期</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>6月</option>
              <option>5月</option>
              <option>4月</option>
              <option>3月</option>
              <option>2月</option>
              <option>1月</option>
            </select>
          </div>
        </div>
      </div>

      {/* 报告列表 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">历史报告</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="搜索报告..."
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                筛选
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报告名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报告类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报告周期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">生成时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">生成人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">{report.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.createTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.creator}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate('report-preview')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        预览
                      </button>
                      <button className="text-green-600 hover:text-green-800">导出</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 24 条记录，当前第 1/6 页
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportPreviewPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  return (
    <div className="p-6">
      {/* 返回按钮 */}
      <button
        onClick={() => onNavigate('report')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        返回报告列表
      </button>

      {/* 报告头部 */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">新余市交通治超综合监管平台</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">2026年5月治超月度报告</h2>
          <div className="text-sm text-gray-600">
            报告周期：2026年5月1日 - 2026年5月31日 | 生成时间：2026-06-01 09:00:00
          </div>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: '超限车辆总数', value: '1,248', unit: '辆', trend: '-12%' },
            { label: '违法车辆数量', value: '326', unit: '辆', trend: '-8%' },
            { label: '黑名单车辆数量', value: '45', unit: '辆', trend: '+5%' },
            { label: '遮挡号牌数量', value: '78', unit: '次', trend: '-15%' },
            { label: '平均超限率', value: '18.5', unit: '%', trend: '-3%' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 mb-2">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 mb-1">{stat.unit}</div>
              <div className={`text-xs font-medium ${stat.trend.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 趋势图 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">超限车辆趋势</h3>
            <div className="bg-gray-50 rounded h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-sm mb-1">折线图: 日均超限车辆数</div>
                <div className="text-xs">5月1日-5月31日</div>
              </div>
            </div>
          </div>

          {/* 饼图 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">车辆颜色分布</h3>
            <div className="bg-gray-50 rounded h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-sm mb-1">饼图: 车辆颜色占比</div>
                <div className="text-xs">蓝35% | 白28% | 红20% | 其他17%</div>
              </div>
            </div>
          </div>

          {/* 柱状图1 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">各检测点超限统计</h3>
            <div className="bg-gray-50 rounded h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-sm mb-1">柱状图: 检测点超限数量</div>
                <div className="text-xs">渝水区 | 仙女湖 | 分宜县 | 高新区</div>
              </div>
            </div>
          </div>

          {/* 柱状图2 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">车辆轴数统计</h3>
            <div className="bg-gray-50 rounded h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-sm mb-1">柱状图: 不同轴数车辆数量</div>
                <div className="text-xs">2轴 | 3轴 | 4轴 | 5轴 | 6轴</div>
              </div>
            </div>
          </div>
        </div>

        {/* 企业违法排行 */}
        <div className="border border-gray-200 rounded-lg p-4 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">企业违法排行（TOP10）</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">排名</th>
                <th className="px-4 py-2 text-left">企业名称</th>
                <th className="px-4 py-2 text-right">违法次数</th>
                <th className="px-4 py-2 text-right">超限率</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: '新余市建材运输有限公司', count: 45, rate: '23.5%' },
                { rank: 2, name: '新钢物流有限责任公司', count: 38, rate: '19.2%' },
                { rank: 3, name: '江西众腾物流有限公司', count: 32, rate: '18.8%' },
              ].map((item) => (
                <tr key={item.rank} className="border-t border-gray-100">
                  <td className="px-4 py-2">{item.rank}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-right font-semibold">{item.count}</td>
                  <td className="px-4 py-2 text-right text-red-600">{item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分析结论 */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">分析结论</h3>
          <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
            <p>1. 本月超限车辆总数较上月下降12%，治超工作成效显著。</p>
            <p>2. 遮挡号牌行为同比下降15%，源头管控措施有效。</p>
            <p>3. 建议加强对排名前三企业的重点监管，减少违法行为。</p>
            <p>4. 黑名单车辆数量有所上升，需加强预警和处罚力度。</p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 justify-end">
        <button className="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
          打印报告
        </button>
        <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
          <Download size={14} />
          导出PDF
        </button>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <Download size={14} />
          导出Excel
        </button>
      </div>
    </div>
  );
};

const DataQueryPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const queryResults = [
    { id: 1, location: '渝水区检测点', time: '2026-06-08 14:23:15', plate: '赣K12345', axles: 6, color: '蓝色', brand: '解放', weight: 52.5, limit: 49, overweight: 3.5, rate: '7.1%', status: '超限' },
    { id: 2, location: '仙女湖检测点', time: '2026-06-08 14:18:42', plate: '赣K67890', axles: 5, color: '白色', brand: '东风', weight: 45.2, limit: 43, overweight: 2.2, rate: '5.1%', status: '超限' },
    { id: 3, location: '分宜县检测点', time: '2026-06-08 14:12:30', plate: '赣K23456', axles: 4, color: '红色', brand: '重汽', weight: 38.5, limit: 36, overweight: 2.5, rate: '6.9%', status: '超限' },
    { id: 4, location: '高新区检测点', time: '2026-06-08 13:58:16', plate: '赣K78901', axles: 6, color: '蓝色', brand: '陕汽', weight: 48.2, limit: 49, overweight: 0, rate: '0%', status: '正常' },
    { id: 5, location: '渝水区检测点', time: '2026-06-08 13:45:03', plate: '赣K34567', axles: 5, color: '绿色', brand: '解放', weight: 42.8, limit: 43, overweight: 0, rate: '0%', status: '正常' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">数据查询</h2>
        <p className="text-sm text-gray-600 mt-1">查询车辆通行及超限信息</p>
      </div>

      {/* 查询条件 */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">查询条件</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              查询
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              重置
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">检测点位置</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部点位</option>
              <option>渝水区检测点</option>
              <option>仙女湖检测点</option>
              <option>分宜县检测点</option>
              <option>高新区检测点</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">车牌号码</label>
            <input
              type="text"
              placeholder="输入车牌号..."
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">开始时间</label>
            <input
              type="datetime-local"
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">结束时间</label>
            <input
              type="datetime-local"
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">车辆轴数</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>不限</option>
              <option>2轴</option>
              <option>3轴</option>
              <option>4轴</option>
              <option>5轴</option>
              <option>6轴</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">车身颜色</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>不限</option>
              <option>蓝色</option>
              <option>白色</option>
              <option>红色</option>
              <option>绿色</option>
              <option>黑色</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">超限状态</label>
            <select className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部</option>
              <option>正常</option>
              <option>超限</option>
            </select>
          </div>
        </div>
      </div>

      {/* 查询结果 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">查询结果</h3>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1">
              <Download size={14} />
              导出Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">检测点</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">通行时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">车牌</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">轴数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">颜色</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">品牌</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">总重(吨)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">限重(吨)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">超重(吨)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">超限率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queryResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{result.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{result.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono font-semibold">{result.plate}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{result.axles}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{result.color}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{result.brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">{result.weight}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">{result.limit}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className={result.overweight > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'}>
                      {result.overweight > 0 ? result.overweight : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className={result.rate !== '0%' ? 'text-red-600 font-semibold' : 'text-gray-400'}>
                      {result.rate}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      result.status === '超限' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">详情</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 2,847 条记录，当前第 1/570 页
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoPatrolPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const [layout, setLayout] = useState<1 | 4 | 9 | 16>(4);
  const [selectedCamera, setSelectedCamera] = useState<string | null>('CAM-001');

  const cameraTree = [
    {
      name: '渝水区',
      cameras: [
        { id: 'CAM-001', name: '渝水区检测点-入口', online: true },
        { id: 'CAM-002', name: '渝水区检测点-出口', online: true },
        { id: 'CAM-003', name: '袁河大道监控点', online: false },
      ]
    },
    {
      name: '仙女湖区',
      cameras: [
        { id: 'CAM-004', name: '仙女湖检测点-入口', online: true },
        { id: 'CAM-005', name: '仙女湖检测点-出口', online: true },
      ]
    },
    {
      name: '分宜县',
      cameras: [
        { id: 'CAM-006', name: '分宜县检测点-入口', online: true },
        { id: 'CAM-007', name: '分宜县检测点-出口', online: true },
        { id: 'CAM-008', name: '钤山东路监控点', online: true },
      ]
    },
    {
      name: '高新区',
      cameras: [
        { id: 'CAM-009', name: '高新区检测点-入口', online: true },
        { id: 'CAM-010', name: '高新区检测点-出口', online: false },
      ]
    },
  ];

  const VideoPlayer = ({ cameraId }: { cameraId: string }) => (
    <div className="bg-gray-900 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Camera className="mx-auto mb-2 text-gray-600" size={48} />
          <p className="text-sm text-gray-400">{cameraId}</p>
          <p className="text-xs text-gray-500 mt-1">视频流接入位置</p>
        </div>
      </div>
      <div className="bg-gray-900 p-2 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Play size={16} className="text-white" />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Pause size={16} className="text-white" />
          </button>
          <button className="p-1.5 hover:bg-gray-800 rounded">
            <Volume2 size={16} className="text-white" />
          </button>
        </div>
        <button className="p-1.5 hover:bg-gray-800 rounded">
          <Maximize size={16} className="text-white" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">视频巡查</h2>
        <p className="text-sm text-gray-600 mt-1">实时查看监控视频</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* 左侧摄像头列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索摄像头..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 flex gap-2">
            <button className="flex-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
              在线 (10)
            </button>
            <button className="flex-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              离线 (2)
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {cameraTree.map((group, idx) => (
              <div key={idx}>
                <div className="text-xs font-semibold text-gray-700 mb-2 px-2">{group.name}</div>
                {group.cameras.map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between mb-1 ${
                      selectedCamera === camera.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Camera size={14} />
                      {camera.name}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${camera.online ? 'bg-green-500' : 'bg-red-500'}`} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧视频区域 */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 4, 9, 16].map((num) => (
                <button
                  key={num}
                  onClick={() => setLayout(num as 1 | 4 | 9 | 16)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    layout === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {num}屏
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              在线摄像头: <span className="font-semibold text-green-600">10</span> /
              总数: <span className="font-semibold">12</span>
            </div>
          </div>

          {/* 视频网格 */}
          <div className={`grid gap-2 ${
            layout === 1 ? 'grid-cols-1' :
            layout === 4 ? 'grid-cols-2 grid-rows-2' :
            layout === 9 ? 'grid-cols-3 grid-rows-3' :
            'grid-cols-4 grid-rows-4'
          }`}>
            {Array.from({ length: layout }).map((_, idx) => (
              <div key={idx} style={{ aspectRatio: '16/9' }}>
                <VideoPlayer cameraId={`CAM-${String(idx + 1).padStart(3, '0')}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BlacklistPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const blacklistVehicles = [
    { id: 1, plate: '赣K12345', color: '蓝色', brand: '解放', company: '新余市建材运输有限公司', violationType: '多次超限', status: '监控中', addTime: '2026-05-15', lastSeen: '2026-06-08 14:23', alertCount: 8 },
    { id: 2, plate: '赣K67890', color: '白色', brand: '东风', company: '江西众腾物流有限公司', violationType: '遮挡号牌', status: '监控中', addTime: '2026-05-20', lastSeen: '2026-06-08 12:15', alertCount: 5 },
    { id: 3, plate: '赣K23456', color: '红色', brand: '重汽', company: '新余市恒通货运公司', violationType: '严重超限', status: '已处理', addTime: '2026-04-10', lastSeen: '2026-06-05 16:42', alertCount: 12 },
    { id: 4, plate: '赣K78901', color: '绿色', brand: '陕汽', company: '新钢物流有限责任公司', violationType: '多次违法', status: '监控中', addTime: '2026-05-28', lastSeen: '2026-06-08 09:30', alertCount: 6 },
    { id: 5, plate: '赣K34567', color: '蓝色', brand: '福田', company: '渝水区鑫盛运输队', violationType: '拒不配合检查', status: '监控中', addTime: '2026-06-01', lastSeen: '2026-06-07 18:20', alertCount: 3 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">黑名单管理</h2>
        <p className="text-sm text-gray-600 mt-1">管理违法车辆黑名单并预警跟踪</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '黑名单总数', value: '45', color: 'red' },
          { label: '监控中', value: '32', color: 'yellow' },
          { label: '已处理', value: '13', color: 'green' },
          { label: '本月预警', value: '127', color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-semibold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 mb-4">
        <div className="flex gap-2">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="搜索车牌号、所属公司..."
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-2.5 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>全部状态</option>
            <option>监控中</option>
            <option>已处理</option>
          </select>
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Search size={14} />
            查询
          </button>
          <button className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
            + 新增黑名单
          </button>
        </div>
      </div>

      {/* 黑名单列表 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">黑名单车辆列表</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1">
              <Download size={14} />
              导出
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">车牌号码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">车辆信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属公司</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">违法类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">录入时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最近出现</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">预警次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blacklistVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-semibold text-gray-900">{vehicle.plate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicle.brand}</div>
                    <div className="text-xs text-gray-500">{vehicle.color}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{vehicle.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      {vehicle.violationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vehicle.addTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vehicle.lastSeen}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-red-600">{vehicle.alertCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      vehicle.status === '监控中' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onNavigate('blacklist-detail')}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      查看轨迹
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">编辑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 45 条记录，当前第 1/9 页
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlacklistDetailPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const timeline = [
    { time: '2026-06-08 14:23:15', location: '渝水区检测点', event: '触发预警', status: 'alert' },
    { time: '2026-06-08 09:30:42', location: '仙女湖检测点', event: '通过检测', status: 'pass' },
    { time: '2026-06-07 16:15:28', location: '高新区检测点', event: '触发预警', status: 'alert' },
    { time: '2026-06-07 08:45:10', location: '分宜县检测点', event: '通过检测', status: 'pass' },
    { time: '2026-06-06 14:20:33', location: '渝水区检测点', event: '触发预警', status: 'alert' },
    { time: '2026-06-05 11:38:56', location: '仙女湖检测点', event: '通过检测', status: 'pass' },
  ];

  return (
    <div className="p-6">
      {/* 返回按钮 */}
      <button
        onClick={() => onNavigate('blacklist')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        返回黑名单列表
      </button>

      {/* 车辆基本信息 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">黑名单车辆详情</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-mono font-semibold text-lg text-gray-900">赣K12345</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">多次超限</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg">
            监控中
          </span>
        </div>

        <div className="grid grid-cols-6 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">车辆品牌</div>
            <div className="text-sm font-semibold text-gray-900">解放</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">车身颜色</div>
            <div className="text-sm font-semibold text-gray-900">蓝色</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">所属公司</div>
            <div className="text-sm font-semibold text-gray-900">新余市建材运输有限公司</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">录入时间</div>
            <div className="text-sm font-semibold text-gray-900">2026-05-15</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">预警次数</div>
            <div className="text-sm font-semibold text-red-600">8次</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">最近出现</div>
            <div className="text-sm font-semibold text-gray-900">2026-06-08 14:23</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 轨迹时间线 */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">车辆轨迹时间线</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'alert' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{item.location}</span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  <div className="text-sm text-gray-600">{item.event}</div>
                  {item.status === 'alert' && (
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                      查看详情 →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 轨迹地图 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">轨迹地图</h3>
          <div className="bg-gray-100 rounded-lg h-[480px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-sm text-gray-500 mb-2">新余市区域示意图</p>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>预警点位</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>正常通过</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-6 flex gap-2 justify-end">
        <button className="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50 transition-colors">
          移出黑名单
        </button>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          编辑信息
        </button>
      </div>
    </div>
  );
};

const BasicInfoPage: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'vehicle' | 'enterprise' | 'checkpoint' | 'camera'>('vehicle');

  const vehicles = [
    { id: 1, plate: '赣K12345', brand: '解放', color: '蓝色', type: '重型货车', axles: 6, company: '新余市建材运输有限公司', contact: '张师傅', phone: '13907905001' },
    { id: 2, plate: '赣K67890', brand: '东风', color: '白色', type: '重型货车', axles: 5, company: '江西众腾物流有限公司', contact: '李师傅', phone: '13907905002' },
    { id: 3, plate: '赣K23456', brand: '重汽', color: '红色', type: '重型货车', axles: 4, company: '新余市恒通货运公司', contact: '王师傅', phone: '13907905003' },
  ];

  const checkpoints = [
    { id: 1, name: '渝水区检测点', area: '渝水区', address: '仙来大道与袁河大道交叉口', lat: '27.8105', lng: '114.9167', cameras: 8, status: '运行中' },
    { id: 2, name: '仙女湖检测点', area: '仙女湖区', address: '仙女湖大道南段', lat: '27.7856', lng: '114.9423', cameras: 5, status: '运行中' },
    { id: 3, name: '分宜县检测点', area: '分宜县', address: '钤山东路298号', lat: '27.8142', lng: '114.6923', cameras: 7, status: '运行中' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">基础信息管理</h2>
        <p className="text-sm text-gray-600 mt-1">维护车辆、企业、检测点等基础数据</p>
      </div>

      {/* Tab 导航 */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'vehicle', label: '车辆信息', icon: '🚛' },
            { key: 'enterprise', label: '企业信息', icon: '🏢' },
            { key: 'checkpoint', label: '检测点管理', icon: '📍' },
            { key: 'camera', label: '摄像头管理', icon: '📹' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* 车辆信息 */}
          {activeTab === 'vehicle' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="搜索车牌号、公司名称..."
                    className="px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                    <Search size={14} />
                    查询
                  </button>
                </div>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  + 新增车辆
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">车牌号码</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">车辆品牌</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">车身颜色</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">车辆类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">轴数</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属公司</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">联系人</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono font-semibold text-gray-900">{vehicle.plate}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{vehicle.brand}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{vehicle.color}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{vehicle.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{vehicle.axles}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.company}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{vehicle.contact}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                        <button className="text-red-600 hover:text-red-800">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 检测点管理 */}
          {activeTab === 'checkpoint' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="搜索检测点名称..."
                    className="px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                    <Search size={14} />
                    查询
                  </button>
                </div>
                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  + 新增检测点
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">检测点名称</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属区域</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">详细位置</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">经纬度</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">摄像头数量</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {checkpoints.map((checkpoint) => (
                    <tr key={checkpoint.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{checkpoint.name}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{checkpoint.area}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{checkpoint.address}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {checkpoint.lat}, {checkpoint.lng}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{checkpoint.cameras}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          {checkpoint.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                        <button className="text-red-600 hover:text-red-800">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 其他 Tab 占位 */}
          {activeTab === 'enterprise' && (
            <div className="text-center py-12 text-gray-500">
              企业信息管理功能（参考源头管控页面）
            </div>
          )}
          {activeTab === 'camera' && (
            <div className="text-center py-12 text-gray-500">
              摄像头管理功能（参考视频巡查页面）
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
