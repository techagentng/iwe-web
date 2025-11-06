/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./contexts/ThemeContext.tsx":
/*!***********************************!*\
  !*** ./contexts/ThemeContext.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction ThemeProvider({ children }) {\n    const [theme, setThemeState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('light');\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    // Load theme from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"ThemeProvider.useEffect\": ()=>{\n            setMounted(true);\n            if (false) {}\n        }\n    }[\"ThemeProvider.useEffect\"], []);\n    // Update document class and localStorage when theme changes\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"ThemeProvider.useEffect\": ()=>{\n            if (mounted && \"undefined\" !== 'undefined') {}\n        }\n    }[\"ThemeProvider.useEffect\"], [\n        theme,\n        mounted\n    ]);\n    const toggleTheme = ()=>{\n        setThemeState((prev)=>prev === 'light' ? 'dark' : 'light');\n    };\n    const setTheme = (newTheme)=>{\n        setThemeState(newTheme);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme,\n            setTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/nnahnnamdi/Desktop/iwe-react/contexts/ThemeContext.tsx\",\n        lineNumber: 51,\n        columnNumber: 5\n    }, this);\n}\nfunction useTheme() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (context === undefined) {\n        throw new Error('useTheme must be used within a ThemeProvider');\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4RTtBQVU5RSxNQUFNSyw2QkFBZUosb0RBQWFBLENBQStCSztBQUUxRCxTQUFTQyxjQUFjLEVBQUVDLFFBQVEsRUFBaUM7SUFDdkUsTUFBTSxDQUFDQyxPQUFPQyxjQUFjLEdBQUdOLCtDQUFRQSxDQUFRO0lBQy9DLE1BQU0sQ0FBQ08sU0FBU0MsV0FBVyxHQUFHUiwrQ0FBUUEsQ0FBQztJQUV2Qyx3Q0FBd0M7SUFDeENELGdEQUFTQTttQ0FBQztZQUNSUyxXQUFXO1lBQ1gsSUFBSSxLQUE2QixFQUFFLEVBU2xDO1FBQ0g7a0NBQUcsRUFBRTtJQUVMLDREQUE0RDtJQUM1RFQsZ0RBQVNBO21DQUFDO1lBQ1IsSUFBSVEsV0FBVyxnQkFBa0IsYUFBYSxFQUs3QztRQUNIO2tDQUFHO1FBQUNGO1FBQU9FO0tBQVE7SUFFbkIsTUFBTWdCLGNBQWM7UUFDbEJqQixjQUFjLENBQUNrQixPQUFVQSxTQUFTLFVBQVUsU0FBUztJQUN2RDtJQUVBLE1BQU1DLFdBQVcsQ0FBQ0M7UUFDaEJwQixjQUFjb0I7SUFDaEI7SUFFQSxxQkFDRSw4REFBQ3pCLGFBQWEwQixRQUFRO1FBQUNDLE9BQU87WUFBRXZCO1lBQU9rQjtZQUFhRTtRQUFTO2tCQUMxRHJCOzs7Ozs7QUFHUDtBQUVPLFNBQVN5QjtJQUNkLE1BQU1DLFVBQVVoQyxpREFBVUEsQ0FBQ0c7SUFDM0IsSUFBSTZCLFlBQVk1QixXQUFXO1FBQ3pCLE1BQU0sSUFBSTZCLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyIvVXNlcnMvbm5haG5uYW1kaS9EZXNrdG9wL2l3ZS1yZWFjdC9jb250ZXh0cy9UaGVtZUNvbnRleHQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG50eXBlIFRoZW1lID0gJ2xpZ2h0JyB8ICdkYXJrJztcblxuaW50ZXJmYWNlIFRoZW1lQ29udGV4dFR5cGUge1xuICB0aGVtZTogVGhlbWU7XG4gIHRvZ2dsZVRoZW1lOiAoKSA9PiB2b2lkO1xuICBzZXRUaGVtZTogKHRoZW1lOiBUaGVtZSkgPT4gdm9pZDtcbn1cblxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxUaGVtZUNvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gIGNvbnN0IFt0aGVtZSwgc2V0VGhlbWVTdGF0ZV0gPSB1c2VTdGF0ZTxUaGVtZT4oJ2xpZ2h0Jyk7XG4gIGNvbnN0IFttb3VudGVkLCBzZXRNb3VudGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBMb2FkIHRoZW1lIGZyb20gbG9jYWxTdG9yYWdlIG9uIG1vdW50XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TW91bnRlZCh0cnVlKTtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHNhdmVkVGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSBhcyBUaGVtZSB8IG51bGw7XG4gICAgICBjb25zdCBwcmVmZXJzRGFyayA9IHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlcztcbiAgICAgIFxuICAgICAgaWYgKHNhdmVkVGhlbWUpIHtcbiAgICAgICAgc2V0VGhlbWVTdGF0ZShzYXZlZFRoZW1lKTtcbiAgICAgIH0gZWxzZSBpZiAocHJlZmVyc0RhcmspIHtcbiAgICAgICAgc2V0VGhlbWVTdGF0ZSgnZGFyaycpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW10pO1xuXG4gIC8vIFVwZGF0ZSBkb2N1bWVudCBjbGFzcyBhbmQgbG9jYWxTdG9yYWdlIHdoZW4gdGhlbWUgY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChtb3VudGVkICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodCcsICdkYXJrJyk7XG4gICAgICByb290LmNsYXNzTGlzdC5hZGQodGhlbWUpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgdGhlbWUpO1xuICAgIH1cbiAgfSwgW3RoZW1lLCBtb3VudGVkXSk7XG5cbiAgY29uc3QgdG9nZ2xlVGhlbWUgPSAoKSA9PiB7XG4gICAgc2V0VGhlbWVTdGF0ZSgocHJldikgPT4gKHByZXYgPT09ICdsaWdodCcgPyAnZGFyaycgOiAnbGlnaHQnKSk7XG4gIH07XG5cbiAgY29uc3Qgc2V0VGhlbWUgPSAobmV3VGhlbWU6IFRoZW1lKSA9PiB7XG4gICAgc2V0VGhlbWVTdGF0ZShuZXdUaGVtZSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHRoZW1lLCB0b2dnbGVUaGVtZSwgc2V0VGhlbWUgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9UaGVtZUNvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VUaGVtZSgpIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXNlVGhlbWUgbXVzdCBiZSB1c2VkIHdpdGhpbiBhIFRoZW1lUHJvdmlkZXInKTtcbiAgfVxuICByZXR1cm4gY29udGV4dDtcbn1cbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJUaGVtZUNvbnRleHQiLCJ1bmRlZmluZWQiLCJUaGVtZVByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ0aGVtZSIsInNldFRoZW1lU3RhdGUiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsInNhdmVkVGhlbWUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicHJlZmVyc0RhcmsiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInJvb3QiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsInNldEl0ZW0iLCJ0b2dnbGVUaGVtZSIsInByZXYiLCJzZXRUaGVtZSIsIm5ld1RoZW1lIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZVRoZW1lIiwiY29udGV4dCIsIkVycm9yIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./contexts/ThemeContext.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var _tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query-devtools */ \"@tanstack/react-query-devtools\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/contexts/ThemeContext */ \"(pages-dir-node)/./contexts/ThemeContext.tsx\");\n/* harmony import */ var next_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next-i18next */ \"next-i18next\");\n/* harmony import */ var next_i18next__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_i18next__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__, _tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_3__]);\n([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__, _tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    // Create a client instance per app instance to avoid sharing state between users\n    const [queryClient] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)({\n        \"App.useState\": ()=>new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClient({\n                defaultOptions: {\n                    queries: {\n                        staleTime: 60 * 1000,\n                        refetchOnWindowFocus: false,\n                        retry: 1\n                    }\n                }\n            })\n    }[\"App.useState\"]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n        client: queryClient,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_5__.ThemeProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/nnahnnamdi/Desktop/iwe-react/pages/_app.tsx\",\n                    lineNumber: 27,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/nnahnnamdi/Desktop/iwe-react/pages/_app.tsx\",\n                lineNumber: 26,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query_devtools__WEBPACK_IMPORTED_MODULE_3__.ReactQueryDevtools, {\n                initialIsOpen: false\n            }, void 0, false, {\n                fileName: \"/Users/nnahnnamdi/Desktop/iwe-react/pages/_app.tsx\",\n                lineNumber: 29,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/nnahnnamdi/Desktop/iwe-react/pages/_app.tsx\",\n        lineNumber: 25,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_i18next__WEBPACK_IMPORTED_MODULE_6__.appWithTranslation)(App));\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBOEI7QUFFMkM7QUFDTDtBQUNuQztBQUN1QjtBQUNOO0FBRWxELFNBQVNNLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDN0MsaUZBQWlGO0lBQ2pGLE1BQU0sQ0FBQ0MsWUFBWSxHQUFHTiwrQ0FBUUE7d0JBQzVCLElBQ0UsSUFBSUgsOERBQVdBLENBQUM7Z0JBQ2RVLGdCQUFnQjtvQkFDZEMsU0FBUzt3QkFDUEMsV0FBVyxLQUFLO3dCQUNoQkMsc0JBQXNCO3dCQUN0QkMsT0FBTztvQkFDVDtnQkFDRjtZQUNGOztJQUdKLHFCQUNFLDhEQUFDYixzRUFBbUJBO1FBQUNjLFFBQVFOOzswQkFDM0IsOERBQUNMLGlFQUFhQTswQkFDWiw0RUFBQ0c7b0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7MEJBRTFCLDhEQUFDTiw4RUFBa0JBO2dCQUFDYyxlQUFlOzs7Ozs7Ozs7Ozs7QUFHekM7QUFFQSxpRUFBZVgsZ0VBQWtCQSxDQUFDQyxJQUFJQSxFQUFDIiwic291cmNlcyI6WyIvVXNlcnMvbm5haG5uYW1kaS9EZXNrdG9wL2l3ZS1yZWFjdC9wYWdlcy9fYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ0Avc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSc7XG5pbXBvcnQgeyBSZWFjdFF1ZXJ5RGV2dG9vbHMgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnktZGV2dG9vbHMnO1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnQC9jb250ZXh0cy9UaGVtZUNvbnRleHQnO1xuaW1wb3J0IHsgYXBwV2l0aFRyYW5zbGF0aW9uIH0gZnJvbSAnbmV4dC1pMThuZXh0JztcblxuZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgLy8gQ3JlYXRlIGEgY2xpZW50IGluc3RhbmNlIHBlciBhcHAgaW5zdGFuY2UgdG8gYXZvaWQgc2hhcmluZyBzdGF0ZSBiZXR3ZWVuIHVzZXJzXG4gIGNvbnN0IFtxdWVyeUNsaWVudF0gPSB1c2VTdGF0ZShcbiAgICAoKSA9PlxuICAgICAgbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgICAgICAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICAgICAgICBxdWVyaWVzOiB7XG4gICAgICAgICAgICBzdGFsZVRpbWU6IDYwICogMTAwMCwgXG4gICAgICAgICAgICByZWZldGNoT25XaW5kb3dGb2N1czogZmFsc2UsXG4gICAgICAgICAgICByZXRyeTogMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgPFRoZW1lUHJvdmlkZXI+XG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICAgIDxSZWFjdFF1ZXJ5RGV2dG9vbHMgaW5pdGlhbElzT3Blbj17ZmFsc2V9IC8+XG4gICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhcHBXaXRoVHJhbnNsYXRpb24oQXBwKTtcbiJdLCJuYW1lcyI6WyJRdWVyeUNsaWVudCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJSZWFjdFF1ZXJ5RGV2dG9vbHMiLCJ1c2VTdGF0ZSIsIlRoZW1lUHJvdmlkZXIiLCJhcHBXaXRoVHJhbnNsYXRpb24iLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJxdWVyeUNsaWVudCIsImRlZmF1bHRPcHRpb25zIiwicXVlcmllcyIsInN0YWxlVGltZSIsInJlZmV0Y2hPbldpbmRvd0ZvY3VzIiwicmV0cnkiLCJjbGllbnQiLCJpbml0aWFsSXNPcGVuIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "@tanstack/react-query-devtools":
/*!*************************************************!*\
  !*** external "@tanstack/react-query-devtools" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query-devtools");;

/***/ }),

/***/ "next-i18next":
/*!*******************************!*\
  !*** external "next-i18next" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-i18next");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();