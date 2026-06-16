/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax.
 *
 * @author Hakim El Hattab
 */
var RevealMath =
  window.RevealMath ||
  (function() {
    var options = Reveal.getConfig().math || {};
    // Default to MathJax v3 loader (async)
    options.mathjax =
      options.mathjax ||
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";

    loadScript(options.mathjax, function() {
      // MathJax v3 uses a different API. Configure if present.
      if (window.MathJax && MathJax.startup) {
        // Ensure MathJax processes math in slides when shown
        MathJax.startup.promise.then(function() {
          // Initial typeset
          MathJax.typesetPromise();
          Reveal.layout();
        });

        Reveal.addEventListener("slidechanged", function(event) {
          MathJax.typesetPromise([event.currentSlide]).catch(function(err) {
            console.warn("MathJax typeset failed:", err);
          });
        });
      }
    });

    function loadScript(url, callback) {
      var head = document.querySelector("head");
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;

      // Wrapper for callback to make sure it only fires once
      var finish = function() {
        if (typeof callback === "function") {
          callback.call();
          callback = null;
        }
      };

      script.onload = finish;

      // IE
      script.onreadystatechange = function() {
        if (this.readyState === "loaded") {
          finish();
        }
      };

      // Normal browsers
      head.appendChild(script);
    }
  })();
