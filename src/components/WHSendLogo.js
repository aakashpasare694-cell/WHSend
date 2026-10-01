import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const WHSendLogo = ({ size = 'md', showText = true, showBadge = true, className = '', }) => {
    const iconSizes = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    };
    const svgSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    };
    const textSizes = {
        sm: 'text-base',
        md: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-4xl',
    };
    return (_jsxs("div", { className: `flex items-center gap-3 select-none ${className}`, children: [_jsx("div", { className: `relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[1.5px] shadow-lg shadow-emerald-500/20 group hover:shadow-emerald-500/40 transition-all duration-300`, children: _jsxs("div", { className: "w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20 opacity-80 group-hover:opacity-100 transition-opacity" }), _jsxs("svg", { className: `${svgSizes[size]} text-emerald-400 relative z-10 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-105`, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.5828 3.40871 15.0701 4.12658 16.3686L3.10557 19.9371C2.96443 20.4311 3.40871 20.8754 3.90269 20.7343L7.47124 19.7133C8.76974 20.4311 10.257 20.8398 11.8398 20.8398", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M8.5 12L15.5 8.5L12.5 15.5L11 13L8.5 12Z", fill: "url(#whsend-grad)", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("defs", { children: _jsxs("linearGradient", { id: "whsend-grad", x1: "8.5", y1: "8.5", x2: "15.5", y2: "15.5", gradientUnits: "userSpaceOnUse", children: [_jsx("stop", { stopColor: "#34d399" }), _jsx("stop", { offset: "1", stopColor: "#22d3ee" })] }) })] })] }) }), showText && (_jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: `font-black tracking-tight ${textSizes[size]} text-white font-['Plus_Jakarta_Sans',sans-serif]`, children: ["WH", _jsx("span", { className: "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent", children: "Send" })] }), showBadge && (_jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wide uppercase", children: "v1.0" }))] }), _jsx("span", { className: "text-[11px] font-semibold tracking-wider uppercase text-slate-400 -mt-1", children: "WhatsApp Gateway" })] }))] }));
};
