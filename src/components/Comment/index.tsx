const Comment: React.FC = () => (
  <section
    ref={elem => {
      if (!elem) {
        return;
      }
      const scriptElem = document.createElement('script');
      scriptElem.src = 'https://utteranc.es/client.js';
      scriptElem.async = true;
      scriptElem.crossOrigin = 'anonymous';
      scriptElem.setAttribute('repo', 'caiulucas/ignite-spacetraveling');
      scriptElem.setAttribute('issue-term', 'pathname');
      scriptElem.setAttribute('label', 'blog-comment');
      scriptElem.setAttribute('theme', 'photon-dark');
      elem.appendChild(scriptElem);
    }}
  />
);

export default Comment;
