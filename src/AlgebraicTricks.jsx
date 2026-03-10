import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';

const T = {
  bg: '#080c18', card: '#0f1628', cardAlt: '#141c33',
  accent: '#c9a227', accentDim: 'rgba(201,162,39,0.15)',
  blue: '#5b8def', blueDim: 'rgba(91,141,239,0.12)',
  green: '#3ecf8e', greenDim: 'rgba(62,207,142,0.12)',
  red: '#ef6b6b', redDim: 'rgba(239,107,107,0.12)',
  text: '#e8e6e1', textDim: '#8a8780', textMuted: '#5a5750',
  border: '#1e2540',
  font: "'Crimson Pro',Georgia,serif",
  fontBody: "'Inter','Segoe UI',sans-serif",
  fontMono: "'JetBrains Mono','Fira Code',monospace",
};

// Render LaTeX: parse $...$ and $$...$$ in text strings
function Tex({ children, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || typeof children !== 'string') return;
    const text = children;
    // Split on $$...$$ (display) and $...$ (inline)
    const parts = [];
    let i = 0;
    while (i < text.length) {
      // Check for display math $$...$$
      if (text[i] === '$' && text[i+1] === '$') {
        const end = text.indexOf('$$', i + 2);
        if (end !== -1) {
          parts.push({ type: 'display', tex: text.slice(i + 2, end) });
          i = end + 2;
          continue;
        }
      }
      // Check for inline math $...$
      if (text[i] === '$') {
        const end = text.indexOf('$', i + 1);
        if (end !== -1) {
          parts.push({ type: 'inline', tex: text.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
      // Regular text - accumulate until next $
      const next = text.indexOf('$', i);
      if (next === -1) {
        parts.push({ type: 'text', content: text.slice(i) });
        break;
      } else {
        parts.push({ type: 'text', content: text.slice(i, next) });
        i = next;
      }
    }
    // Render
    let html = '';
    for (const part of parts) {
      if (part.type === 'text') {
        html += part.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      } else {
        try {
          html += katex.renderToString(part.tex, {
            displayMode: part.type === 'display',
            throwOnError: false,
            trust: true,
          });
        } catch (e) {
          html += '<span style="color:#ef6b6b">' + part.tex + '</span>';
        }
      }
    }
    ref.current.innerHTML = html;
  }, [children]);
  return React.createElement('span', { ref, style });
}

// Block-level LaTeX renderer (for paragraphs)
function TexBlock({ children, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || typeof children !== 'string') return;
    const text = children;
    const parts = [];
    let i = 0;
    while (i < text.length) {
      if (text[i] === '$' && text[i+1] === '$') {
        const end = text.indexOf('$$', i + 2);
        if (end !== -1) {
          parts.push({ type: 'display', tex: text.slice(i + 2, end) });
          i = end + 2;
          continue;
        }
      }
      if (text[i] === '$') {
        const end = text.indexOf('$', i + 1);
        if (end !== -1) {
          parts.push({ type: 'inline', tex: text.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
      const next = text.indexOf('$', i);
      if (next === -1) {
        parts.push({ type: 'text', content: text.slice(i) });
        break;
      } else {
        parts.push({ type: 'text', content: text.slice(i, next) });
        i = next;
      }
    }
    let html = '';
    for (const part of parts) {
      if (part.type === 'text') {
        html += part.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      } else {
        try {
          html += katex.renderToString(part.tex, {
            displayMode: part.type === 'display',
            throwOnError: false,
            trust: true,
          });
        } catch (e) {
          html += '<span style="color:#ef6b6b">' + part.tex + '</span>';
        }
      }
    }
    ref.current.innerHTML = html;
  }, [children]);
  return React.createElement('div', { ref, style });
}

const CH1 = {
  id:'add-zero', num:1, title:'Adding Zero Creatively', subtitle:'The most powerful move: insert a term and its negative',
  defs:[
    { term:'Add-and-Subtract', formal:'To analyze $a - c$, insert a bridge term $b$: $a - c = (a - b) + (b - c)$. Each piece is chosen to be easier to bound or simplify than the original.',
      intuition:'Imagine walking from city A to city C. The direct path is unclear, but if you stop at city B, each leg is straightforward. That intermediate stop is the term you add and subtract.',
      example:'To show $|a_n - L|$ is small: $|a_n - L| = |(a_n - b_n) + (b_n - L)| \leq |a_n - b_n| + |b_n - L|$. Now bound each piece separately.'
    },
    { term:'The $\\varepsilon/2$ Budget', formal:'When proving $a_n \\to L$, given $\\varepsilon > 0$, allocate $\\varepsilon/2$ to each of two pieces. If $|a_n - b_n| < \\varepsilon/2$ and $|b_n - L| < \\varepsilon/2$, then $|a_n - L| < \\varepsilon$.',
      intuition:'You have an error budget of $\\varepsilon$. Split it equally between two sources of error. Each piece gets half the budget, and the total stays within bounds. For $k$ pieces, use $\\varepsilon/k$.',
      example:'Proving $\\lim(a_n + b_n) = A + B$: $|(a_n + b_n) - (A + B)| = |(a_n - A) + (b_n - B)| \\leq |a_n - A| + |b_n - B| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$.'
    },
    { term:'Telescoping Insertion', formal:'Write $a_n - a_1 = \\sum (a_{k+1} - a_k)$ for $k = 1 \\ldots n-1$. This converts a global difference into a sum of local steps.',
      intuition:'To measure the total distance from start to finish, sum up the distance of each individual step. This is how you turn a single complicated expression into many simple ones.',
      example:'$\\sum \\frac{1}{k(k+1)} = \\sum \\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) = 1 - \\frac{1}{n+1}$. The intermediate terms all cancel.'
    },
    { term:'Anchoring to a Known Quantity', formal:'When estimating $f(x)$, write $f(x) = f(x_0) + (f(x) - f(x_0))$ where $x_0$ is a convenient reference point. The first term is known; bound the second.',
      intuition:'If you know the temperature at noon, estimate 2pm by saying "noon\'s temp plus the change." You anchor to something you know, then control the deviation.',
      example:'Estimating $\\sqrt{4.01}$: $\\sqrt{4.01} = \\sqrt{4} + (\\sqrt{4.01} - \\sqrt{4}) = 2 + \\text{(small correction)}$. The correction is approximately $0.01/(2\\sqrt{4}) = 0.0025$.'
    }
  ],
  explained:[
    { id:'az1', difficulty:1, statement:'Prove that if $a_n \\to L$ and $b_n \\to M$, then $a_n + b_n \\to L + M$.',
      steps:[
        {title:'Identify the trick needed', content:'We need $|(a_n + b_n) - (L + M)| < \\varepsilon$. This is a single expression involving TWO sequences. The trick: regroup to isolate each sequence.'},
        {title:'Add zero: insert $-L + L$', content:'$|(a_n + b_n) - (L + M)| = |(a_n - L) + (b_n - M)|$. No term was added or removed — we just regrouped. Now apply the triangle inequality.'},
        {title:'Apply triangle inequality and budget $\\varepsilon$', content:'$\\leq |a_n - L| + |b_n - M|$. Allocate $\\varepsilon/2$ to each. Since $a_n \\to L$, $\\exists N_1$ with $|a_n - L| < \\varepsilon/2$ for $n \\geq N_1$. Since $b_n \\to M$, $\\exists N_2$ with $|b_n - M| < \\varepsilon/2$ for $n \\geq N_2$.'},
        {title:'Combine', content:'Let $N = \\max\\{N_1, N_2\\}$. For $n \\geq N$: $|(a_n + b_n) - (L + M)| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$. $\\blacksquare$ The key trick was regrouping (adding zero) and then splitting the $\\varepsilon$ budget.'}
      ], answer:'$a_n + b_n \\to L + M$ by the add-and-subtract regrouping + $\\varepsilon/2$ trick'
    },
    { id:'az2', difficulty:2, statement:'Prove: if $a_n \\to L$, then $|a_n| \\to |L|$.',
      steps:[
        {title:'Start from the goal', content:'We need $||a_n| - |L|| < \\varepsilon$. The expression $||a_n| - |L||$ looks hard to work with directly.'},
        {title:'Use reverse triangle inequality', content:'The reverse triangle inequality says $||a| - |b|| \\leq |a - b|$. So $||a_n| - |L|| \\leq |a_n - L|$.'},
        {title:'Use convergence of $a_n$', content:'Since $a_n \\to L$, given $\\varepsilon > 0$, $\\exists N$ with $|a_n - L| < \\varepsilon$ for $n \\geq N$. Therefore $||a_n| - |L|| \\leq |a_n - L| < \\varepsilon$. $\\blacksquare$'},
        {title:'Why this matters', content:'The trick here was recognizing that the reverse triangle inequality lets you bound a complicated expression by a simpler one. You didn\'t add zero explicitly, but you used an inequality that essentially "adds zero" inside the absolute value.'}
      ], answer:'$||a_n| - |L|| \\leq |a_n - L| < \\varepsilon$'
    },
    { id:'az3', difficulty:3, statement:'Prove that $a_n b_n \\to LM$ when $a_n \\to L$ and $b_n \\to M$.',
      steps:[
        {title:'The key trick: add and subtract $Lb_n$', content:'$|a_n b_n - LM| = |a_n b_n - Lb_n + Lb_n - LM| = |(a_n - L)b_n + L(b_n - M)|$. We inserted $-Lb_n + Lb_n = 0$ to create two terms we can handle.'},
        {title:'Apply triangle inequality', content:'$\\leq |a_n - L||b_n| + |L||b_n - M|$. Now we need to bound each piece. The second term is easy: $|L||b_n - M| < |L| \\cdot \\varepsilon/(2|L| + 1)$. But the first term has $|b_n|$ which varies!'},
        {title:'Bound the varying factor', content:'Since $b_n \\to M$, the sequence $(b_n)$ is bounded: $\\exists B > 0$ with $|b_n| \\leq B$ for all $n$. Now $|a_n - L||b_n| \\leq B|a_n - L| < B \\cdot \\varepsilon/(2B) = \\varepsilon/2$.'},
        {title:'Assemble the budget', content:'Choose $N$ large enough that $|a_n - L| < \\varepsilon/(2B)$ and $|b_n - M| < \\varepsilon/(2(|L| + 1))$. Then $|a_n b_n - LM| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$. $\\blacksquare$ Three tricks in one proof: add-and-subtract, bounding a variable factor, and $\\varepsilon$-budgeting.'}
      ], answer:'$a_n b_n \\to LM$ via add-subtract $Lb_n$, bounding $b_n$, and $\\varepsilon/2$ split'
    },
    { id:'az4', difficulty:4, statement:'Prove: $\\sum \\frac{1}{k(k+1)}$ from $k=1$ to $n$ equals $1 - \\frac{1}{n+1}$ using telescoping.',
      steps:[
        {title:'Decompose via partial fractions', content:'$\\frac{1}{k(k+1)} = \\frac{A}{k} + \\frac{B}{k+1}$. Multiply through: $1 = A(k+1) + Bk$. Set $k=0$: $A=1$. Set $k=-1$: $B=-1$. So $\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$.'},
        {title:'Write out the sum', content:'$\\sum \\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) = \\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\left(\\frac{1}{3} - \\frac{1}{4}\\right) + \\ldots + \\left(\\frac{1}{n} - \\frac{1}{n+1}\\right)$.'},
        {title:'Watch the cancellation', content:'Each $-\\frac{1}{k+1}$ from one term cancels the $+\\frac{1}{k+1}$ from the next. This is why it is called "telescoping" — the sum collapses like a telescope.'},
        {title:'What remains', content:'Only the first term of the first summand and the last term of the last summand survive: $1 - \\frac{1}{n+1}$. $\\blacksquare$ The trick was adding zero repeatedly — each $-\\frac{1}{k+1} + \\frac{1}{k+1} = 0$ cancellation is an instance of the pattern.'}
      ], answer:'$\\sum \\frac{1}{k(k+1)} = 1 - \\frac{1}{n+1}$ by partial fractions then telescoping'
    },
    { id:'az5', difficulty:5, statement:'Prove: if $a_n$ is Cauchy and a subsequence $a_{n_k} \\to L$, then $a_n \\to L$.',
      steps:[
        {title:'The bridge term', content:'We need $|a_n - L| < \\varepsilon$. The trick: insert the bridge $-a_{n_k} + a_{n_k} = 0$. So $|a_n - L| = |(a_n - a_{n_k}) + (a_{n_k} - L)| \\leq |a_n - a_{n_k}| + |a_{n_k} - L|$.'},
        {title:'Budget $\\varepsilon/2$ to each piece', content:'Cauchy gives $N_1$ with $|a_n - a_m| < \\varepsilon/2$ for $m,n \\geq N_1$. Subsequence convergence gives $K$ with $|a_{n_k} - L| < \\varepsilon/2$ for $k \\geq K$.'},
        {title:'Choose the bridge carefully', content:'Pick $k \\geq K$ large enough that $n_k \\geq N_1$ as well. Then for $n \\geq N_1$: $|a_n - a_{n_k}| < \\varepsilon/2$ (both indices $\\geq N_1$) and $|a_{n_k} - L| < \\varepsilon/2$ ($k \\geq K$).'},
        {title:'Conclude', content:'$|a_n - L| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$ for all $n \\geq N_1$. $\\blacksquare$ The entire proof is one application of add-and-subtract with the subsequence term as bridge.'}
      ], answer:'$a_n \\to L$ via bridge term $a_{n_k}$ with $\\varepsilon/2$ budget'
    }
  ],
  practice:[
    { id:'azp1', difficulty:1, statement:'To prove $|(a_n + b_n) - (A + B)| < \\varepsilon$, what is the first move?',
      steps:[
        { question:'How do you rewrite $(a_n + b_n) - (A + B)$?', options:['$(a_n - A) + (b_n - B)$','$a_n b_n - AB$','$(a_n + b_n)(A + B)$','$a_n - b_n + A - B$'],correct:0,
          explanations:['Correct! Regroup to isolate each sequence\'s deviation from its limit. This is the add-and-subtract pattern.','That would be relevant for proving a product limit, not a sum.','Multiplying doesn\'t help here — we need to isolate each sequence.','Check your signs: $(a_n + b_n) - (A + B) = a_n - A + b_n - B$, not $a_n - b_n + A - B$.']},
        { question:'After applying the triangle inequality, how should you split the $\\varepsilon$ budget?', options:['$\\varepsilon/2$ to each term','All $\\varepsilon$ to the first term','$\\varepsilon/3$ to each term','$\\sqrt{\\varepsilon}$ to each term'],correct:0,
          explanations:['Correct! Two terms, each gets $\\varepsilon/2$. Then $\\varepsilon/2 + \\varepsilon/2 = \\varepsilon$.','Then you have no budget left for the second term.','That would give total $2\\varepsilon/3 < \\varepsilon$, which works but wastes budget. Standard practice is $\\varepsilon/2$.','That doesn\'t sum to $\\varepsilon$: $\\sqrt{\\varepsilon} + \\sqrt{\\varepsilon} = 2\\sqrt{\\varepsilon} \\neq \\varepsilon$.']},
        { question:'Why do we take $N = \\max\\{N_1, N_2\\}$?', options:['So both bounds hold simultaneously for $n \\geq N$','It gives a tighter bound','It\'s required by the Archimedean property','To make $N$ as large as possible'],correct:0,
          explanations:['Correct! For $n \\geq \\max\\{N_1, N_2\\}$, both $n \\geq N_1$ and $n \\geq N_2$, so both $\\varepsilon/2$ bounds hold at once.','max actually gives a looser $N$, but it ensures both conditions hold.','The Archimedean property helps find each $N_i$, but max combines them.','We don\'t want $N$ large for its own sake — we need both conditions to hold.']}
      ]
    },
    { id:'azp2', difficulty:3, statement:'In the product limit proof ($a_n b_n \\to LM$), what term do you add and subtract?',
      steps:[
        { question:'To split $a_n b_n - LM$ into manageable pieces, insert:', options:['$Lb_n$ (giving $(a_n - L)b_n + L(b_n - M))$','$a_n M$ (giving $a_n(b_n - M) + (a_n - L)M$)','$(a_n + L)(b_n + M)/2$','$LM/2$'],correct:0,
          explanations:['Correct! This is the standard choice. You could also use $a_n M$ (option B) — both work. The key insight is inserting a "mixed" term.','This also works! $a_n b_n - a_n M + a_n M - LM = a_n(b_n - M) + M(a_n - L)$. But the standard approach uses $Lb_n$.','This doesn\'t factor into useful pieces.','This doesn\'t relate to the structure of the expression.']},
        { question:'Why is bounding $|b_n|$ necessary in the $(a_n - L)b_n$ term?', options:['Because $b_n$ varies with $n$, so we need a fixed bound $B$','Because $b_n$ could be zero','Because $|b_n| \\geq |M|$','To apply the Archimedean property'],correct:0,
          explanations:['Correct! We need $|a_n - L| \\cdot |b_n| < \\varepsilon/2$, which means $|a_n - L| < \\varepsilon/(2|b_n|)$. Since $|b_n|$ varies, we bound it by a constant $B$, then require $|a_n - L| < \\varepsilon/(2B)$.','$b_n \\to M$ so for large $n$, $b_n \\neq 0$ (if $M \\neq 0$). But the real reason is we need a fixed number in the bound.','Not necessarily true, and not the reason.','The Archimedean property might help find $N$, but the bound is needed to set up the $\\varepsilon$-budget.']},
        { question:'What convergence property guarantees $b_n$ is bounded?', options:['Every convergent sequence is bounded','Every monotone sequence is bounded','The Bolzano–Weierstrass theorem','The completeness axiom'],correct:0,
          explanations:['Correct! If $b_n \\to M$, then $(b_n)$ is convergent, hence bounded. This is a foundational fact used constantly.','Monotone sequences need not be bounded (e.g., $n$ is monotone increasing and unbounded).','BW says bounded sequences have convergent subsequences — the reverse direction.','Completeness guarantees sups exist, not directly that sequences are bounded.']}
      ]
    },
    { id:'azp3', difficulty:5, statement:'Recognize the add-and-subtract trick: prove $|a_n^2 - L^2| \\to 0$ given $a_n \\to L$.',
      steps:[
        { question:'What factoring helps with $a_n^2 - L^2$?', options:['$(a_n - L)(a_n + L)$ — difference of squares','$(a_n - L)^2 + 2L(a_n - L)$','$a_n(a_n - L) + L(a_n - L)$','All three are valid'],correct:3,
          explanations:['This is the classic approach: $|a_n^2 - L^2| = |a_n - L||a_n + L|$. But see option D.','This also works: $a_n^2 - L^2 = (a_n - L)^2 + 2L(a_n - L)$. Both terms have factor $(a_n - L)$. But see option D.','Also valid: $a_n^2 - L^2 = a_n(a_n - L) + L(a_n - L) = (a_n + L)(a_n - L)$. But see option D.','Correct! All three factorings work. The add-and-subtract insight is that you can decompose $a_n^2 - L^2$ multiple ways, and all lead to a proof.']},
        { question:'Using $|a_n^2 - L^2| = |a_n - L||a_n + L|$, what do you need to bound?', options:['$|a_n + L|$, since $a_n$ varies','$|a_n - L|$, since we don\'t know the limit','Both — neither is fixed','Only $|a_n - L|$ since $|a_n + L|$ is always small'],correct:0,
          explanations:['Correct! Since $a_n \\to L$, the sequence is bounded: $|a_n| \\leq B$, so $|a_n + L| \\leq B + |L|$. This gives a fixed bound.','We do know $a_n \\to L$, so $|a_n - L| < \\varepsilon/(B + |L|)$ for large $n$.','$|a_n - L|$ is controlled by convergence; $|a_n + L|$ is controlled by boundedness. Both are handled but differently.','$|a_n + L|$ is approximately $2L$, not small. You need to BOUND it, not assume it\'s small.']},
        { question:'This is the same trick as the product limit proof. What pattern do both share?', options:['Factor into $(\\text{something} \\to 0) \\times (\\text{something bounded})$','Factor into $(\\text{something small}) + (\\text{something small})$','Use the squeeze theorem','Use monotone convergence'],correct:0,
          explanations:['Correct! Both proofs factor the expression as (vanishing term) $\\times$ (bounded term). The vanishing factor goes to 0, the bounded factor stays controlled, so the product goes to 0. This is one of the most important patterns in analysis.','That\'s the add-and-subtract pattern. This is the multiply pattern: small $\\times$ bounded $\\to$ 0.','The squeeze theorem is a different technique.','Monotone convergence requires monotonicity.']}
      ]
    }
  ]
};

const CH2 = {
  id:'multiply-one', num:2, title:'Multiplying by One', subtitle:'Conjugates, strategic factors, and the art of creative multiplication',
  defs:[
    { term:'Conjugate Multiplication', formal:'To simplify $\\sqrt{a} - \\sqrt{b}$, multiply and divide by the conjugate: $\\frac{(\\sqrt{a} - \\sqrt{b})(\\sqrt{a} + \\sqrt{b})}{\\sqrt{a} + \\sqrt{b}} = \\frac{a - b}{\\sqrt{a} + \\sqrt{b}}$.',
      intuition:'Square roots are hard to bound. But the difference of square roots, when multiplied by the sum, becomes a simple difference of the radicands. You trade an ugly expression for a fraction with a nice numerator.',
      example:'$\\sqrt{n+1} - \\sqrt{n} = \\frac{(n+1) - n}{\\sqrt{n+1} + \\sqrt{n}} = \\frac{1}{\\sqrt{n+1} + \\sqrt{n}} \\leq \\frac{1}{2\\sqrt{n}}$.'
    },
    { term:'Multiply by $f/f$', formal:'Insert the factor $\\frac{g(x)}{g(x)} = 1$ to create a useful product or quotient structure. Common choices: $\\frac{n}{n}$, $\\frac{1+x}{1+x}$, $\\frac{e^{-x}}{e^x}$.',
      intuition:'Multiplying by 1 doesn\'t change the value, but it can change the form dramatically. It\'s like rotating a puzzle piece — same piece, but now it fits.',
      example:'To bound $n \\cdot r^n$ for $|r| < 1$: write $n \\cdot r^n = n \\cdot r^{n/2} \\cdot r^{n/2}$ (splitting $r^n$). The first factor $\\to 0$ by one argument, the second $\\to 0$ independently.'
    },
    { term:'Rationalizing the Numerator/Denominator', formal:'When a limit involves $\\sqrt{f(x)} - \\sqrt{g(x)}$ in a fraction, multiply top and bottom by $\\sqrt{f(x)} + \\sqrt{g(x)}$ to eliminate the square roots from one position.',
      intuition:'The numerator has a square root difference that you can\'t evaluate at the limit point. Rationalizing moves the square roots to the denominator where they\'re typically easier to handle (often approaching a nonzero value).',
      example:'$\\lim_{x \\to 0} \\frac{\\sqrt{1+x} - 1}{x}$: multiply by $\\frac{\\sqrt{1+x} + 1}{\\sqrt{1+x} + 1}$ to get $\\frac{x}{x(\\sqrt{1+x} + 1)} = \\frac{1}{\\sqrt{1+x} + 1} \\to \\frac{1}{2}$.'
    },
    { term:'Strategic Factoring Out', formal:'Factor out the dominant term: for large $n$, $a^n + b^n = a^n\\left(1 + (b/a)^n\\right)$ when $a > b$. The parenthetical term $\\to 1$.',
      intuition:'When comparing terms of different sizes, factor out the big one. What remains is 1 plus something small. This is how you find the "leading behavior" of an expression.',
      example:'$\\frac{3^n + 2^n}{3^n} = 1 + (2/3)^n \\to 1$, since $(2/3)^n \\to 0$. So $3^n + 2^n$ grows like $3^n$.'
    }
  ],
  explained:[
    { id:'mo1', difficulty:1, statement:'Find $\\lim_{x \\to 0} \\frac{\\sqrt{1+x} - 1}{x}$.',
      steps:[
        {title:'Direct substitution fails', content:'At $x=0$: $\\frac{\\sqrt{1} - 1}{0} = \\frac{0}{0}$. Indeterminate form. We need an algebraic trick.'},
        {title:'Multiply by the conjugate / conjugate', content:'$\\frac{\\sqrt{1+x} - 1}{x} \\times \\frac{\\sqrt{1+x} + 1}{\\sqrt{1+x} + 1} = \\frac{(1+x) - 1}{x(\\sqrt{1+x} + 1)} = \\frac{x}{x(\\sqrt{1+x} + 1)}$.'},
        {title:'Cancel and evaluate', content:'$= \\frac{1}{\\sqrt{1+x} + 1}$. Now substitute $x=0$: $\\frac{1}{\\sqrt{1} + 1} = \\frac{1}{2}$. $\\blacksquare$ The conjugate multiplication converted the $0/0$ form into something cancellable.'}
      ], answer:'$\\frac{1}{2}$'
    },
    { id:'mo2', difficulty:2, statement:'Prove: $\\sqrt{n+1} - \\sqrt{n} \\to 0$.',
      steps:[
        {title:'The difference of square roots is hard to bound directly', content:'$\\sqrt{n+1} - \\sqrt{n} > 0$ and should go to 0, but how fast? The conjugate trick will tell us.'},
        {title:'Multiply by conjugate', content:'$\\sqrt{n+1} - \\sqrt{n} = \\frac{(\\sqrt{n+1} - \\sqrt{n})(\\sqrt{n+1} + \\sqrt{n})}{\\sqrt{n+1} + \\sqrt{n}} = \\frac{(n+1) - n}{\\sqrt{n+1} + \\sqrt{n}} = \\frac{1}{\\sqrt{n+1} + \\sqrt{n}}$.'},
        {title:'Bound and conclude', content:'$\\frac{1}{\\sqrt{n+1} + \\sqrt{n}} \\leq \\frac{1}{2\\sqrt{n}} \\to 0$ as $n \\to \\infty$. Given $\\varepsilon > 0$, choose $N > \\frac{1}{4\\varepsilon^2}$. Then for $n \\geq N$: $\\frac{1}{2\\sqrt{n}} < \\varepsilon$. $\\blacksquare$'}
      ], answer:'$\\sqrt{n+1} - \\sqrt{n} = \\frac{1}{\\sqrt{n+1} + \\sqrt{n}} \\to 0$'
    },
    { id:'mo3', difficulty:3, statement:'Simplify and find the limit: $\\lim_{n \\to \\infty} n(\\sqrt{n^2 + 1} - n)$.',
      steps:[
        {title:'This is $\\infty \\cdot 0$ form', content:'$n \\to \\infty$ and $\\sqrt{n^2 + 1} - n \\to 0$. We need to find the exact rate. Multiply by the conjugate.'},
        {title:'Conjugate trick on the square root part', content:'$n(\\sqrt{n^2 + 1} - n) = n \\cdot \\frac{(n^2 + 1) - n^2}{\\sqrt{n^2 + 1} + n} = \\frac{n}{\\sqrt{n^2 + 1} + n}$.'},
        {title:'Factor out $n$ from the denominator', content:'$= \\frac{n}{n(\\sqrt{1 + 1/n^2} + 1)} = \\frac{1}{\\sqrt{1 + 1/n^2} + 1}$. This is the "factor out the dominant term" trick.'},
        {title:'Evaluate the limit', content:'As $n \\to \\infty$, $1/n^2 \\to 0$, so $\\sqrt{1 + 1/n^2} \\to 1$. The limit is $\\frac{1}{1 + 1} = \\frac{1}{2}$. $\\blacksquare$ Two tricks: conjugate multiplication, then factoring out the dominant term.'}
      ], answer:'$\\frac{1}{2}$'
    },
    { id:'mo4', difficulty:4, statement:'Prove that $\\lim_{n \\to \\infty} n^{1/n} = 1$.',
      steps:[
        {title:'Write $n^{1/n} = 1 + h_n$ where $h_n \\geq 0$', content:'Since $n \\geq 1$, we have $n^{1/n} \\geq 1$. Define $h_n = n^{1/n} - 1 \\geq 0$. We want to show $h_n \\to 0$. This is the "subtract 1 and study the deviation" trick.'},
        {title:'Expand using binomial inequality', content:'$n = (1 + h_n)^n \\geq 1 + nh_n + \\frac{n(n-1)h_n^2}{2}$ (by the binomial theorem, keeping only some terms). In particular, $n \\geq \\frac{n(n-1)h_n^2}{2}$ for $n \\geq 2$.'},
        {title:'Solve for $h_n$', content:'$h_n^2 \\leq \\frac{2n}{n(n-1)} = \\frac{2}{n-1}$. So $h_n \\leq \\sqrt{\\frac{2}{n-1}} \\to 0$. $\\blacksquare$'},
        {title:'The multiplying-by-1 insight', content:'By writing $n^{1/n} = 1 + h_n$, we "multiplied by 1" in a structural sense: we anchored to 1 and studied the excess. Then we used the fact that $(1+h)^n$ grows much faster than linearly to force $h$ to be small.'}
      ], answer:'$n^{1/n} \\to 1$ (via the substitution $h_n = n^{1/n} - 1$ and binomial bound)'
    },
    { id:'mo5', difficulty:5, statement:'Prove: if $\\sum |a_k|$ converges, then $|\\sum a_k| \\leq \\sum |a_k|$ (absolute convergence implies convergence).',
      steps:[
        {title:'The trick: shift to make everything nonnegative', content:'Define $b_k = a_k + |a_k|$. Then $0 \\leq b_k \\leq 2|a_k|$. We "multiplied by 1" conceptually by writing $a_k = b_k - |a_k|$.'},
        {title:'Both series converge', content:'Since $0 \\leq b_k \\leq 2|a_k|$ and $\\sum |a_k|$ converges, by comparison $\\sum b_k$ converges. Also $\\sum |a_k|$ converges by assumption.'},
        {title:'Express the original series', content:'$\\sum a_k = \\sum (b_k - |a_k|) = \\sum b_k - \\sum |a_k|$. Difference of convergent series converges. $\\blacksquare$'},
        {title:'Pattern recognition', content:'The trick was adding $|a_k|$ to $a_k$ to make it nonnegative (multiplying the "signed" problem by a shift to create a "positive" problem). Then we decomposed the original as a difference of two convergent nonneg series.'}
      ], answer:'$\\sum a_k$ converges via the decomposition $a_k = (a_k + |a_k|) - |a_k|$'
    }
  ],
  practice:[
    { id:'mop1', difficulty:1, statement:'$\\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}$. What trick do you use?',
      steps:[
        { question:'This is $0/0$ at $x=4$. What algebraic trick resolves it?', options:['Multiply by $(\\sqrt{x} + 2)/(\\sqrt{x} + 2)$ to rationalize','L\'Hôpital\'s rule','Factor $x - 4$ as $(x-1)(x+1)$','Substitute $u = x - 4$'],correct:0,
          explanations:['Correct! $(\\sqrt{x} - 2)(\\sqrt{x} + 2) = x - 4$, so the numerator becomes $x - 4$ and cancels with the denominator.','That works too but we\'re focusing on algebraic tricks, not calculus rules.','$x - 4 = (x - 4)$, and $(\\sqrt{x} - 2)$ is not a polynomial factor. Use the conjugate instead.','This doesn\'t resolve the square root.']},
        { question:'After rationalizing, what is the simplified expression?', options:['$\\frac{1}{\\sqrt{x} + 2}$','$\\frac{\\sqrt{x} + 2}{x}$','$\\frac{\\sqrt{x}}{x - 4}$','$2\\sqrt{x}$'],correct:0,
          explanations:['Correct! $\\frac{\\sqrt{x} - 2}{x - 4} \\times \\frac{\\sqrt{x} + 2}{\\sqrt{x} + 2} = \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}$.','Check the algebra: numerator becomes $x - 4$, denominator becomes $(x - 4)(\\sqrt{x} + 2)$.','The $(x - 4)$ should cancel, not remain.','This doesn\'t match the computation.']},
        { question:'What is the limit?', options:['$\\frac{1}{4}$','$\\frac{1}{2}$','$2$','$0$'],correct:0,
          explanations:['Correct! As $x \\to 4$: $\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{2 + 2} = \\frac{1}{4}$. $\\blacksquare$','Careful: $\\sqrt{4} = 2$, so the denominator is $2 + 2 = 4$, not 2.','That would be $\\sqrt{4}$, not $\\frac{1}{\\sqrt{4} + 2}$.','The numerator and denominator both approach 0, but the ratio approaches $\\frac{1}{4}$.']}
      ]
    },
    { id:'mop2', difficulty:3, statement:'Prove that $(2^n + 3^n)^{1/n} \\to 3$ as $n \\to \\infty$. What is the key trick?',
      steps:[
        { question:'What should you factor out from $2^n + 3^n$?', options:['$3^n$, giving $3((2/3)^n + 1)^{1/n}$','$2^n$, giving $2(1 + (3/2)^n)^{1/n}$','$6^n$','Nothing — use logarithms directly'],correct:0,
          explanations:['Correct! $2^n + 3^n = 3^n((2/3)^n + 1)$. Then $(2^n + 3^n)^{1/n} = 3 \\cdot ((2/3)^n + 1)^{1/n}$. Since $(2/3)^n \\to 0$, this $\\to 3 \\cdot 1 = 3$.','This gives $2(1 + (3/2)^n)^{1/n}$ where $(3/2)^n \\to \\infty$, which is harder to handle. Factor out the DOMINANT term.','$6^n$ doesn\'t factor out of $2^n + 3^n$.','Logarithms work but the factoring trick is more elegant and direct.']},
        { question:'Why factor out the LARGEST base?', options:['Because then the ratio $(\\text{smaller}/\\text{larger})^n \\to 0$, simplifying to 1','Because the smallest base is always negligible','Because you must always factor out the maximum','Because it makes the exponent cancel'],correct:0,
          explanations:['Correct! If you factor out $3^n$, the remaining $(2/3)^n \\to 0$ since $|2/3| < 1$. This leaves $3 \\cdot (0 + 1)^{1/n} = 3 \\cdot 1 = 3$.','The smallest base isn\'t always negligible (e.g., if bases are 2 and 3 vs 2.99 and 3).','It\'s a strategic choice, not a requirement. But it gives the cleanest result.','The exponent $1/n$ still matters: $(1 + 0)^{1/n} = 1^{1/n} = 1$.']},
        { question:'What bound proves $((2/3)^n + 1)^{1/n} \\to 1$?', options:['$1 \\leq ((2/3)^n + 1)^{1/n} \\leq 2^{1/n}$, and $2^{1/n} \\to 1$','Use L\'Hôpital on the logarithm','AM-GM inequality','Taylor expansion of $(1+x)^{1/n}$'],correct:0,
          explanations:['Correct! Since $0 < (2/3)^n < 1$, we have $1 < (2/3)^n + 1 < 2$. Taking $n$-th roots: $1 < ((2/3)^n + 1)^{1/n} < 2^{1/n}$. Since $2^{1/n} \\to 1$, the squeeze theorem finishes it. $\\blacksquare$','That works but is heavier machinery. The squeeze is cleaner.','AM-GM doesn\'t directly apply here.','Valid approach but unnecessarily complex.']}
      ]
    },
    { id:'mop3', difficulty:5, statement:'$\\lim_{n \\to \\infty} (\\sqrt{n^2 + n} - n)$. Identify and execute the trick.',
      steps:[
        { question:'What is the first move?', options:['Multiply by $(\\sqrt{n^2 + n} + n)/(\\sqrt{n^2 + n} + n)$','Factor $n^2$ from inside the radical','Take logarithms','Substitute $m = 1/n$'],correct:0,
          explanations:['Correct! This is the conjugate trick. $(\\sqrt{n^2 + n} - n)(\\sqrt{n^2 + n} + n)/(\\sqrt{n^2 + n} + n) = (n^2 + n - n^2)/(\\sqrt{n^2 + n} + n) = n/(\\sqrt{n^2 + n} + n)$.','That\'s actually the second step! After the conjugate, you\'ll factor $n$ from the denominator.','Logarithms don\'t simplify this form.','That changes the nature of the limit.']},
        { question:'After the conjugate trick gives $n/(\\sqrt{n^2 + n} + n)$, what next?', options:['Factor $n$ out of $\\sqrt{n^2 + n}$ to get $n\\sqrt{1 + 1/n}$, then simplify','L\'Hôpital\'s rule','Bound above and below','Just substitute $n = \\infty$'],correct:0,
          explanations:['Correct! $\\sqrt{n^2 + n} = n\\sqrt{1 + 1/n}$. So the expression $= \\frac{n}{n\\sqrt{1 + 1/n} + n} = \\frac{1}{\\sqrt{1 + 1/n} + 1}$. This is factoring out the dominant term.','We\'re doing algebra, not calculus rules.','That could work but factoring is more direct.','$\\infty$ is not a number. We need the algebraic simplification.']},
        { question:'What is the final answer?', options:['$\\frac{1}{2}$','$1$','$0$','$\\infty$'],correct:0,
          explanations:['Correct! $\\frac{1}{\\sqrt{1 + 1/n} + 1} \\to \\frac{1}{\\sqrt{1} + 1} = \\frac{1}{2}$. $\\blacksquare$ Two tricks: conjugate multiplication then factoring out the dominant term.','As $n \\to \\infty$, $\\frac{1}{\\sqrt{1 + 0} + 1} = \\frac{1}{2}$, not 1.','The expression approaches $\\frac{1}{2}$, not 0.','The conjugate trick showed it\'s finite.']}
      ]
    }
  ]
};


const CH3 = {
  id: 'triangle-ineq',
  num: 3,
  title: 'The Triangle Inequality Toolbox',
  subtitle: 'Your most-used bounding tool in analysis',
  defs: [
    {
      term: 'Basic Triangle Inequality',
      formal: '$|a + b| \\leq |a| + |b|$ for all real numbers $a, b$',
      intuition: 'If you walk from point A to point B, the straight-line distance is never more than walking from A to some intermediate point, then to B. Taking absolute values is like measuring the actual distance traveled regardless of direction.',
      example: 'If $a = 3$ and $b = -5$, then $|3 + (-5)| = |-2| = 2$, while $|3| + |-5| = 3 + 5 = 8$. Indeed, $2 \\leq 8$.'
    },
    {
      term: 'Reverse Triangle Inequality',
      formal: '$||a| - |b|| \\leq |a - b|$ for all real numbers $a, b$',
      intuition: 'The difference between how "big" two numbers are is smaller than the distance between the numbers themselves. Removing absolute values from inside can only shrink the gap.',
      example: 'If $a = 7$ and $b = 3$, then $||7| - |3|| = |7 - 3| = 4$, and $|7 - 3| = 4$. We have equality here, but consider $a = -7, b = 3$: $||-7| - |3|| = |7 - 3| = 4$, while $|-7 - 3| = 10$. Indeed, $4 \\leq 10$.'
    },
    {
      term: 'Iterated Triangle Inequality',
      formal: '$|\\sum_{k=1}^{n} a_k| \\leq \\sum_{k=1}^{n} |a_k|$ for any finite collection of real numbers $a_1, a_2, \\ldots, a_n$',
      intuition: 'Adding many numbers is like taking a multi-step journey. The total distance traveled is at most the sum of each individual leg. Cancellations can make the final sum small, but the sum of absolute values counts every bit of movement.',
      example: 'If $a_1 = 2, a_2 = -3, a_3 = 1$, then $|2 + (-3) + 1| = |0| = 0$, while $|2| + |-3| + |1| = 2 + 3 + 1 = 6$. We have $0 \\leq 6$ because the terms cancel.'
    },
    {
      term: '$\\varepsilon$-Splitting with Triangle Inequality',
      formal: 'For $k$ terms, allocate $\\varepsilon/k$ to each triangle inequality application: if $|a_j - b_j| < \\varepsilon/k$ for $j = 1,\\ldots,k$, then $|\\sum_j a_j - \\sum_j b_j| \\leq \\sum_j|a_j - b_j| < k \\cdot (\\varepsilon/k) = \\varepsilon$',
      intuition: 'When you have multiple sources of error, split your error budget equally among them. By making each piece small enough, the total stays under control—this is the $\\varepsilon/k$ trick widely used in analysis proofs.',
      example: 'To prove $\\sum_{k=1}^{3} a_k \\to L$ when each $a_k \\to L_k$ and $\\sum L_k = L$, assign error $\\varepsilon/3$ to each term. Then the total error is at most $3 \\cdot (\\varepsilon/3) = \\varepsilon$.'
    }
  ],
  explained: [
    {
      id: 'ti1',
      difficulty: 1,
      statement: 'Show that $|a - c| \\leq |a - b| + |b - c|$ directly from the basic triangle inequality.',
      steps: [
        {
          title: 'Rewrite the goal',
          content: 'We want to bound $|a - c|$. Notice that $a - c = (a - b) + (b - c)$, so we can rewrite $|a - c| = |(a - b) + (b - c)|$.'
        },
        {
          title: 'Apply triangle inequality',
          content: 'By the basic triangle inequality, $|(a - b) + (b - c)| \\leq |a - b| + |b - c|$.'
        },
        {
          title: 'Conclude',
          content: 'Therefore, $|a - c| \\leq |a - b| + |b - c|$. This is the triangle inequality for distances: the direct path from $a$ to $c$ is at most the path through intermediate point $b$.'
        }
      ],
      answer: '$|a - c| = |(a - b) + (b - c)| \\leq |a - b| + |b - c|$ by the basic triangle inequality.'
    },
    {
      id: 'ti2',
      difficulty: 2,
      statement: 'Prove that $||a_n| - |L|| \\leq |a_n - L|$ and use it to show that if $a_n \\to L$, then $|a_n| \\to |L|$.',
      steps: [
        {
          title: 'Establish the reverse triangle inequality inequality',
          content: 'Start with the reverse triangle inequality: $||a_n| - |L|| \\leq |a_n - L|$. This follows directly from the reverse triangle inequality applied to numbers $a_n$ and $L$.'
        },
        {
          title: 'Use convergence of $a_n$',
          content: 'Since $a_n \\to L$, for any $\\varepsilon > 0$, there exists $N$ such that for all $n > N$, we have $|a_n - L| < \\varepsilon$.'
        },
        {
          title: 'Bound $|a_n| - |L||$',
          content: 'Combining the two facts: $||a_n| - |L|| \\leq |a_n - L| < \\varepsilon$ for all $n > N$.'
        },
        {
          title: 'Conclude convergence',
          content: 'By definition of convergence, $||a_n| - |L|| < \\varepsilon$ for all $n > N$, so $|a_n| \\to |L|$.'
        }
      ],
      answer: '$||a_n| - |L|| \\leq |a_n - L| < \\varepsilon$ for $n$ sufficiently large, so $|a_n| \\to |L|$.'
    },
    {
      id: 'ti3',
      difficulty: 3,
      statement: 'Bound $|a_n b_n - LM|$ using the triangle inequality after an add-subtract trick.',
      steps: [
        {
          title: 'Perform add-subtract',
          content: 'Write $|a_n b_n - LM| = |a_n b_n - a_n M + a_n M - LM| = |(a_n(b_n - M) + M(a_n - L)|$. (This is the add-subtract trick from CH1.)'
        },
        {
          title: 'Apply triangle inequality',
          content: 'By the triangle inequality: $|a_n(b_n - M) + M(a_n - L)| \\leq |a_n(b_n - M)| + |M(a_n - L)| = |a_n||b_n - M| + |M||a_n - L|$.'
        },
        {
          title: 'Use boundedness',
          content: 'Since $a_n \\to L$, the sequence $\\{a_n\\}$ is bounded: $|a_n| \\leq K$ for some $K$. So the bound becomes $K|b_n - M| + |M||a_n - L|$.'
        },
        {
          title: 'Take the limit',
          content: 'Since $b_n \\to M$ and $a_n \\to L$, both $|b_n - M|$ and $|a_n - L|$ approach $0$, so the entire expression approaches $0$. Thus $a_n b_n \\to LM$.'
        }
      ],
      answer: '$|a_n b_n - LM| \\leq |a_n||b_n - M| + |M||a_n - L| < K\\varepsilon/2 + |M|\\varepsilon/2$ for large $n$.'
    },
    {
      id: 'ti4',
      difficulty: 4,
      statement: 'Prove that a uniformly convergent series of bounded functions is bounded: if $|f_n(x)| \\leq M_n$ for all $x$ and $\\sum M_n$ converges, bound $|\\sum f_n(x)|$.',
      steps: [
        {
          title: 'Apply iterated triangle inequality',
          content: 'By the iterated triangle inequality: $|\\sum_{k=1}^{n} f_k(x)| \\leq \\sum_{k=1}^{n} |f_k(x)|$.'
        },
        {
          title: 'Use boundedness of each term',
          content: 'Since $|f_k(x)| \\leq M_k$ for all $x$, we have $\\sum_{k=1}^{n} |f_k(x)| \\leq \\sum_{k=1}^{n} M_k$.'
        },
        {
          title: 'Use convergence of the series',
          content: 'Since $\\sum M_k$ converges, the partial sums $\\sum_{k=1}^{n} M_k$ are bounded by some constant $M$ (the sum of the entire series). Therefore, $\\sum_{k=1}^{n} M_k \\leq M$ for all $n$.'
        },
        {
          title: 'Conclude boundedness',
          content: 'Combining: $|\\sum_{k=1}^{n} f_k(x)| \\leq M$ for all $n$ and all $x$. Taking the limit as $n \\to \\infty$, $|\\sum_{k=1}^{\\infty} f_k(x)| \\leq M$.'
        }
      ],
      answer: '$|\\sum f_n(x)| \\leq \\sum|f_n(x)| \\leq \\sum M_n$, which converges, so the series is bounded.'
    },
    {
      id: 'ti5',
      difficulty: 5,
      statement: 'Prove the Cauchy criterion: if $a_n \\to L$, then $|a_n - a_m| < \\varepsilon$ for all sufficiently large $n, m$. Use $a_n - L$ and $a_m - L$ as a bridge.',
      steps: [
        {
          title: 'Assume convergence',
          content: 'Assume $a_n \\to L$. By definition, for any $\\varepsilon > 0$, there exists $N$ such that for all $k > N$, we have $|a_k - L| < \\varepsilon/2$.'
        },
        {
          title: 'Build the bridge with add-subtract',
          content: 'For $n, m > N$, write $a_n - a_m = (a_n - L) + (L - a_m) = (a_n - L) - (a_m - L)$.'
        },
        {
          title: 'Apply triangle inequality',
          content: 'By the triangle inequality: $|a_n - a_m| = |(a_n - L) - (a_m - L)| \\leq |a_n - L| + |a_m - L|$.'
        },
        {
          title: 'Complete the proof',
          content: 'Since both $|a_n - L| < \\varepsilon/2$ and $|a_m - L| < \\varepsilon/2$ for $n, m > N$, we have $|a_n - a_m| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$. This is the Cauchy criterion.'
        }
      ],
      answer: '$|a_n - a_m| \\leq |a_n - L| + |a_m - L| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$ for $n, m$ sufficiently large.'
    }
  ],
  practice: [
    {
      id: 'tip1',
      difficulty: 2,
      statement: 'Apply the triangle inequality to bound $|a_n + b_n - (L + M)|$ when $a_n \\to L$ and $b_n \\to M$.',
      steps: [
        {
          question: 'How should you rewrite $|a_n + b_n - (L + M)|$ to apply the triangle inequality?',
          options: [
            '$|(a_n - L) + (b_n - M)|',
            '$|(a_n + b_n) - (L + M)|',
            '$|a_n + b_n| - |L + M|',
            '$|(a_n - L) \\cdot (b_n - M)|'
          ],
          correct: 0,
          explanations: [
            'Correct! Rewrite the sum as a sum of differences from limits, so you can apply the basic triangle inequality.',
            'This is equivalent but doesn\'t highlight the structure for applying triangle inequality.',
            'Wrong: you cannot separate absolute values like this; this violates the triangle inequality.',
            'Wrong: the problem is about a sum, not a product.'
          ]
        },
        {
          question: 'After rewriting, what is the correct application of the triangle inequality?',
          options: [
            '$|(a_n - L) + (b_n - M)| \\leq |a_n - L| + |b_n - M|',
            '$|(a_n - L) + (b_n - M)| = |a_n - L| + |b_n - M|',
            '$|(a_n - L) + (b_n - M)| \\geq |a_n - L| + |b_n - M|',
            '$|(a_n - L) + (b_n - M)| < |a_n - L| - |b_n - M|'
          ],
          correct: 0,
          explanations: [
            'Correct! This is the basic triangle inequality applied to $(a_n - L)$ and $(b_n - M)$.',
            'Wrong: the triangle inequality is an inequality, not an equality, unless the terms have the same sign.',
            'Wrong: the triangle inequality goes the other way ($\\leq$, not $\\geq$).',
            'Wrong: the second term should be added, not subtracted.'
          ]
        },
        {
          question: 'Given that $a_n \\to L$ and $b_n \\to M$, and $\\varepsilon > 0$, what can you conclude about $|a_n + b_n - (L + M)|$?',
          options: [
            'For $n$ sufficiently large, $|a_n + b_n - (L + M)| < \\varepsilon$',
            'For $n$ sufficiently large, $|a_n + b_n - (L + M)| \\leq |a_n - L| + |b_n - M| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$',
            'The bound depends only on $a_n$, not on $b_n$',
            '$|a_n + b_n - (L + M)|$ is always greater than $\\varepsilon$'
          ],
          correct: 1,
          explanations: [
            'This conclusion is correct, but the reasoning shown in option 1 is more complete.',
            'Correct! By convergence, we can make each term small by the $\\varepsilon/2$ trick, so their sum is less than $\\varepsilon$.',
            'Wrong: both $a_n$ and $b_n$ contribute to the bound.',
            'Wrong: since $a_n \\to L$ and $b_n \\to M$, the bound can be made arbitrarily small.'
          ]
        }
      ]
    },
    {
      id: 'tip2',
      difficulty: 3,
      statement: 'Use the reverse triangle inequality in a convergence proof: show that if $|a_n - L| \\to 0$, then $|a_n| \\to |L|$.',
      steps: [
        {
          question: 'Which form of the reverse triangle inequality directly compares $|a_n|$ and $|L|$?',
          options: [
            '$||a_n| - |L|| \\leq |a_n - L|',
            '$|a_n - L| \\leq |a_n| - |L|',
            '$||a_n| - |L|| = |a_n - L|',
            '$|a_n + L| \\leq |a_n| + |L|'
          ],
          correct: 0,
          explanations: [
            'Correct! The reverse triangle inequality gives an upper bound on the difference of absolute values.',
            'Wrong: this inequality is backwards and would imply $|a_n|$ and $|L|$ grow as they differ, contradicting convergence.',
            'Wrong: these are equal only in special cases, not in general.',
            'Wrong: this is the basic triangle inequality, not the reverse form.'
          ]
        },
        {
          question: 'Given that $|a_n - L| < \\varepsilon$, what can you conclude about $||a_n| - |L||$ using the reverse triangle inequality?',
          options: [
            '$||a_n| - |L|| < \\varepsilon$',
            '$||a_n| - |L|| > \\varepsilon$',
            '$||a_n| - |L|| \\leq |a_n - L| < \\varepsilon$',
            '$||a_n| - |L|| = \\varepsilon$'
          ],
          correct: 2,
          explanations: [
            'This is correct in conclusion but misses the explicit reasoning step through the reverse triangle inequality.',
            'Wrong: if $|a_n - L|$ is small, then $||a_n| - |L||$ must also be small.',
            'Correct! By the reverse triangle inequality, $||a_n| - |L||$ is bounded by $|a_n - L|$, which is less than $\\varepsilon$.',
            'Wrong: the bound is an inequality, not an equality.'
          ]
        },
        {
          question: 'To prove $|a_n| \\to |L|$, what do you need to show for any $\\varepsilon > 0$?',
          options: [
            'There exists $N$ such that for all $n > N$, $||a_n| - |L|| < \\varepsilon$',
            'There exists $N$ such that for all $n > N$, $|a_n - L| = \\varepsilon$',
            '$||a_n| - |L||$ is always less than $\\varepsilon$, regardless of $n$',
            '$|a_n|$ equals $|L|$ for sufficiently large $n$'
          ],
          correct: 0,
          explanations: [
            'Correct! This is the definition of convergence. Since $||a_n| - |L|| \\leq |a_n - L| < \\varepsilon$ for $n > N$, the reverse triangle inequality completes the proof.',
            'Wrong: equality with $\\varepsilon$ is not what convergence requires; we need the bound to be smaller than $\\varepsilon$.',
            'Wrong: the bound depends on $\\varepsilon$ and must be less than it, so it changes with $\\varepsilon$.',
            'Wrong: convergence is a limit, not exact equality for finite $n$.'
          ]
        }
      ]
    },
    {
      id: 'tip3',
      difficulty: 3,
      statement: 'Bound the partial sum $|\\sum_{k=1}^{n} a_k|$ using the iterated triangle inequality when $|a_k| \\leq M_k$.',
      steps: [
        {
          question: 'What does the iterated triangle inequality say about $|\\sum_{k=1}^{n} a_k|$?',
          options: [
            '$|\\sum_{k=1}^{n} a_k| = \\sum_{k=1}^{n} |a_k|',
            '$|\\sum_{k=1}^{n} a_k| \\leq \\sum_{k=1}^{n} |a_k|',
            '$|\\sum_{k=1}^{n} a_k| \\geq \\sum_{k=1}^{n} |a_k|',
            '$|\\sum_{k=1}^{n} a_k| < \\sum_{k=1}^{n} a_k$'
          ],
          correct: 1,
          explanations: [
            'Wrong: equality holds only if all $a_k$ have the same sign.',
            'Correct! The iterated triangle inequality bounds the absolute value of a sum by the sum of absolute values.',
            'Wrong: the inequality goes the other way; cancellations make the sum smaller, not larger.',
            'Wrong: absolute value makes things non-negative, so the left side is never strictly less than the right in this direction.'
          ]
        },
        {
          question: 'If $|a_k| \\leq M_k$ for all $k$, what is an upper bound for $|\\sum_{k=1}^{n} a_k|$?',
          options: [
            'The maximum of all $M_k$',
            '$\\sum_{k=1}^{n} M_k$',
            '$\\prod_{k=1}^{n} M_k$',
            '$M_n$'
          ],
          correct: 1,
          explanations: [
            'Wrong: the maximum of individual bounds doesn\'t account for adding multiple terms.',
            'Correct! $|\\sum_{k=1}^{n} a_k| \\leq \\sum_{k=1}^{n} |a_k| \\leq \\sum_{k=1}^{n} M_k$ by the iterated triangle inequality and the bound on each term.',
            'Wrong: we\'re adding terms, not multiplying them.',
            'Wrong: this is only the bound for the last term, not the entire sum.'
          ]
        },
        {
          question: 'In what situation would $|\\sum_{k=1}^{n} a_k|$ be much smaller than $\\sum_{k=1}^{n} M_k$?',
          options: [
            'When all $a_k$ are positive',
            'When the terms $a_k$ have mixed signs and cancel out significantly',
            'When $n$ is small',
            'When $M_k$ is very large'
          ],
          correct: 1,
          explanations: [
            'Wrong: if all $a_k$ are positive, then $|\\sum a_k| = \\sum a_k \\leq \\sum M_k$ with equality possible.',
            'Correct! When terms cancel due to opposite signs, the sum shrinks, but the iterated triangle inequality still accounts for each term\'s magnitude via $M_k$.',
            'Wrong: the size of $n$ alone doesn\'t determine how much cancellation occurs.',
            'Wrong: large $M_k$ makes the upper bound larger, not smaller.'
          ]
        }
      ]
    }
  ]
};

const CH4 = {
  id: 'bounding',
  num: 4,
  title: 'Bounding & Estimation',
  subtitle: 'Replacing hard expressions with simpler bounds',
  defs: [
    {
      term: 'The $M$-Bound Trick',
      formal: 'If $a_n \\to L$, then there exists $M > 0$ such that $|a_n| \\leq M$ for all $n \\in \\mathbb{N}$. This is because $a_n$ is eventually within distance $1$ of $L$, so it lies in a bounded region.',
      intuition: 'Convergent sequences don\'t blow up—they settle down. This boundedness is a fundamental property that lets you control their size and use them as factors without breaking things. Convergence $\\Rightarrow$ boundedness is one of your most-used tricks.',
      example: 'If $a_n \\to 5$, then for $n$ large enough, $|a_n - 5| < 1$, so $4 < a_n < 6$. Even for small $n$, the sequence might hit values like $10$ or $-3$, but you can find one $M$ (say $M = 100$) such that $|a_n| \\leq 100$ for all $n$. This $M$ makes $a_n$ "controlled."'
    },
    {
      term: '"For $n$ Sufficiently Large"',
      formal: 'Given a convergent sequence $a_n \\to L$ and $\\varepsilon > 0$, there exists $N$ such that for all $n > N$, $|a_n - L| < \\varepsilon$. We call $n > N$ "sufficiently large"—past the threshold $N$, the sequence is close to $L$.',
      intuition: 'Convergence is a "tail" property: it says eventually the sequence gets close and stays close. For proving results about limits, you only care about what happens far out in the sequence, not the first few terms. This is why we often ignore the initial terms and focus on $n > N$.',
      example: 'If $a_n = 1 + 1/n \\to 1$, then for $\\varepsilon = 0.01$, we need $1/n < 0.01$, so $n > 100$. Thus $N = 100$ works: for all $n > 100$, we have $|a_n - 1| < 0.01$. The first $100$ terms might oscillate wildly, but for $n > 100$, they\'re all within $0.01$ of $1$.'
    },
    {
      term: 'Monotonicity-Based Bounds',
      formal: 'If $f : \\mathbb{R} \\to \\mathbb{R}$ is an increasing function and $x \\leq y$, then $f(x) \\leq f(y)$. This allows replacing a complicated variable with a simpler bound and preserving the inequality.',
      intuition: 'Monotone functions preserve order. By choosing a simpler upper bound on your variable and applying $f$ to the bound, you simplify the problem while keeping the direction of the inequality. This is especially useful with functions like absolute value, squaring, or logarithm.',
      example: 'If $|\\sin(x)| \\leq 1$ and you want to bound $|x \\cdot \\sin(x)|$, you can write $|x \\cdot \\sin(x)| \\leq |x| \\cdot |\\sin(x)| \\leq |x| \\cdot 1 = |x|$. The absolute value function is increasing on $[0, \\infty)$, so $x \\leq 1 \\Rightarrow |x| \\leq 1$.'
    },
    {
      term: 'Squeeze/Comparison Bounding',
      formal: 'If $0 \\leq a_n \\leq b_n$ for all $n$ and $b_n \\to 0$, then $a_n \\to 0$. More generally, if $a_n \\leq c_n \\leq b_n$ and $a_n \\to L, b_n \\to L$, then $c_n \\to L$.',
      intuition: 'If your sequence is sandwiched between two sequences that converge to $0$ (or to the same limit), then your sequence must also converge to that limit. It\'s a way of bounding a complicated sequence by simpler ones and deducing convergence without explicitly computing the limit.',
      example: 'The sequence $a_n = \\sin(n)/n$ satisfies $0 \\leq |\\sin(n)/n| \\leq 1/n$ (since $|\\sin(n)| \\leq 1$). Since $1/n \\to 0$, the squeeze theorem implies $\\sin(n)/n \\to 0$. We don\'t need to know where $\\sin(n)$ goes; the bound controls it.'
    }
  ],
  explained: [
    {
      id: 'b1',
      difficulty: 1,
      statement: 'Show that if $a_n \\to L$, then the sequence $\\{a_n\\}$ is bounded (i.e., $|a_n| \\leq M$ for some $M$ and all $n$).',
      steps: [
        {
          title: 'Apply the definition of convergence',
          content: 'By definition, $a_n \\to L$ means: for any $\\varepsilon > 0$, there exists $N$ such that for all $n > N$, we have $|a_n - L| < \\varepsilon$. Choose $\\varepsilon = 1$.'
        },
        {
          title: 'Bound the tail',
          content: 'For $n > N$, we have $|a_n - L| < 1$. This means $L - 1 < a_n < L + 1$, so $|a_n| < |L| + 1$ for all $n > N$.'
        },
        {
          title: 'Bound the initial segment',
          content: 'Consider the first $N$ terms: $a_1, a_2, \\ldots, a_N$. Let $M_1 = \\max\\{|a_1|, |a_2|, \\ldots, |a_N|\\}$. This is a finite maximum, so $M_1$ is well-defined and finite.'
        },
        {
          title: 'Combine to get overall bound',
          content: 'Set $M = \\max\\{M_1, |L| + 1\\}$. Then $|a_n| \\leq M$ for all $n$: for $n \\leq N$, we have $|a_n| \\leq M_1 \\leq M$, and for $n > N$, we have $|a_n| < |L| + 1 \\leq M$. Thus $\\{a_n\\}$ is bounded.'
        }
      ],
      answer: 'Convergence gives a bound on the tail by $\\varepsilon = 1$, and the initial finite segment has a finite maximum. Taking the larger of the two bounds shows $\\{a_n\\}$ is bounded by some $M$.'
    },
    {
      id: 'b2',
      difficulty: 2,
      statement: 'Prove that if $a_n \\to 0$ and $\\{b_n\\}$ is a bounded sequence, then $a_n b_n \\to 0$.',
      steps: [
        {
          title: 'Use boundedness of $\\{b_n\\}$',
          content: 'Since $\\{b_n\\}$ is bounded, there exists $M > 0$ such that $|b_n| \\leq M$ for all $n$.'
        },
        {
          title: 'Use convergence of $a_n$',
          content: 'Since $a_n \\to 0$, for any $\\varepsilon > 0$, there exists $N$ such that for all $n > N$, $|a_n| < \\varepsilon/M$. (We choose the error budget $\\varepsilon/M$ so that multiplying by $M$ gives $\\varepsilon$.)'
        },
        {
          title: 'Bound the product',
          content: 'For $n > N$, we have $|a_n b_n| = |a_n||b_n| \\leq |a_n| \\cdot M < (\\varepsilon/M) \\cdot M = \\varepsilon$.'
        },
        {
          title: 'Conclude convergence to 0',
          content: 'By definition, $|a_n b_n| < \\varepsilon$ for all $n > N$. Therefore, $a_n b_n \\to 0$.'
        }
      ],
      answer: 'Since $a_n \\to 0$ and $|b_n| \\leq M$, we have $|a_n b_n| < (\\varepsilon/M) \\cdot M = \\varepsilon$ for large $n$, so $a_n b_n \\to 0$.'
    },
    {
      id: 'b3',
      difficulty: 2,
      statement: 'Show that $\\sin(n)/n \\to 0$ using the bound $|\\sin(n)| \\leq 1$.',
      steps: [
        {
          title: 'Write the bound on the numerator',
          content: 'For all $n$, we have $|\\sin(n)| \\leq 1$. This is a well-known fact about the sine function.'
        },
        {
          title: 'Bound the fraction',
          content: 'For $n > 0$, divide both sides by $n$: $|\\sin(n)|/n \\leq 1/n$. Therefore, $|\\sin(n)/n| \\leq 1/n$.'
        },
        {
          title: 'Recognize the squeeze setup',
          content: 'We have $0 \\leq |\\sin(n)/n| \\leq 1/n$. The sequence $1/n \\to 0$ as $n \\to \\infty$ (since for any $\\varepsilon > 0$, choose $N = \\lceil 1/\\varepsilon \\rceil$; then $n > N$ implies $1/n < \\varepsilon$).'
        },
        {
          title: 'Apply squeeze theorem',
          content: 'By the squeeze theorem, since $0$ and $1/n$ both squeeze $|\\sin(n)/n|$, and $1/n \\to 0$, we have $|\\sin(n)/n| \\to 0$. Thus $\\sin(n)/n \\to 0$.'
        }
      ],
      answer: '$|\\sin(n)/n| \\leq 1/n \\to 0$, so by squeeze theorem, $\\sin(n)/n \\to 0$.'
    },
    {
      id: 'b4',
      difficulty: 3,
      statement: 'Prove that $(1 + 1/n)^n$ is bounded above by $3$ using the binomial expansion and bounding.',
      steps: [
        {
          title: 'Expand using binomial theorem',
          content: '$(1 + 1/n)^n = \\sum_{k=0}^{n} \\binom{n}{k} (1/n)^k = 1 + n \\cdot (1/n) + \\binom{n}{2}(1/n)^2 + \\binom{n}{3}(1/n)^3 + \\ldots = 1 + 1 + (n(n-1)/2)/n^2 + (n(n-1)(n-2)/6)/n^3 + \\ldots$'
        },
        {
          title: 'Simplify each term',
          content: 'The general $k$-th term (for $k \\geq 2$) is $\\binom{n}{k}/n^k = (n(n-1)\\ldots(n-k+1))/(k! \\cdot n^k) = 1/(k!) \\cdot (n/n)((n-1)/n)\\ldots((n-k+1)/n) \\leq 1/(k!) \\cdot 1 = 1/k!$. (Each factor $(n-j)/n < 1$.)'
        },
        {
          title: 'Sum the series',
          content: '$(1 + 1/n)^n = 1 + 1 + \\sum_{k=2}^{n} (\\text{term}_k) \\leq 1 + 1 + \\sum_{k=2}^{n} (1/k!) \\leq 2 + \\sum_{k=2}^{\\infty} (1/k!)$. The infinite series $\\sum_{k=0}^{\\infty} (1/k!)$ is the Taylor series for $e \\approx 2.718\\ldots$, so $\\sum_{k=2}^{\\infty} (1/k!) \\approx e - 2 < 1$.'
        },
        {
          title: 'Conclude the bound',
          content: '$(1 + 1/n)^n \\leq 2 + (\\sum_{k=2}^{\\infty} (1/k!)) < 2 + 1 = 3$. Thus $(1 + 1/n)^n$ is bounded above by $3$ for all $n$.'
        }
      ],
      answer: 'By binomial expansion and bounding each term by $1/k!$, we get $(1 + 1/n)^n \\leq 2 + \\sum_{k=2}^{\\infty} (1/k!) < 3$.'
    },
    {
      id: 'b5',
      difficulty: 4,
      statement: 'Bound the tail of a convergent series: if $\\sum a_n$ converges (meaning the series equals some finite sum $S$), show that $|\\sum_{k=N}^{\\infty} a_k| < \\varepsilon$ for sufficiently large $N$.',
      steps: [
        {
          title: 'Define partial sums',
          content: 'Let $S_n = \\sum_{k=1}^{n} a_k$ be the $n$-th partial sum. By definition, $\\sum a_n = \\lim_{n \\to \\infty} S_n = S$ (some finite limit).'
        },
        {
          title: 'Apply convergence of partial sums',
          content: 'Since $S_n \\to S$, for any $\\varepsilon > 0$, there exists $N$ such that for all $m, n > N$, we have $|S_n - S_m| < \\varepsilon$. (This is the Cauchy criterion for series.)'
        },
        {
          title: 'Interpret the difference',
          content: 'For $M > N$, we have $S_M - S_N = \\sum_{k=N+1}^{M} a_k$. So $|\\sum_{k=N+1}^{M} a_k| = |S_M - S_N| < \\varepsilon$.'
        },
        {
          title: 'Take the limit to get the tail',
          content: 'As $M \\to \\infty$, the partial sum $\\sum_{k=N+1}^{M} a_k$ approaches the tail $\\sum_{k=N+1}^{\\infty} a_k$. By continuity of the limit, $|\\sum_{k=N+1}^{\\infty} a_k| = \\lim_{M \\to \\infty} |\\sum_{k=N+1}^{M} a_k| \\leq \\varepsilon$. Therefore, for large $N$, the tail is bounded by $\\varepsilon$.'
        }
      ],
      answer: 'By the Cauchy criterion and taking the limit of partial sums, $|\\sum_{k=N}^{\\infty} a_k| = |S - S_{N-1}| < \\varepsilon$ for large $N$.'
    }
  ],
  practice: [
    {
      id: 'bp1',
      difficulty: 2,
      statement: 'Bound a product where one factor converges to $0$: if $a_n \\to 0$ and $|b_n| \\leq 5$ for all $n$, what can you say about $a_n b_n$?',
      steps: [
        {
          question: 'Since $a_n \\to 0$, what does this tell you about how to control $a_n$ relative to a given error $\\varepsilon$?',
          options: [
            'For any $\\varepsilon > 0$, there exists $N$ such that for $n > N$, $|a_n| < \\varepsilon$',
            'For any $\\varepsilon > 0$, there exists $N$ such that for $n > N$, $|a_n| < \\varepsilon/5$',
            'For any $\\varepsilon > 0$, there exists $N$ such that for $n > N$, $a_n = 0$ exactly',
            '$a_n$ is always less than $1$ for all $n$'
          ],
          correct: 1,
          explanations: [
            'This statement is true but doesn\'t optimize for the product with $b_n$. Since $|b_n| \\leq 5$, you should shrink $a_n$ further to account for multiplication.',
            'Correct! By convergence to $0$, you can make $a_n$ as small as you like. To ensure $|a_n b_n| < \\varepsilon$ after multiplying by at most $5$, choose $|a_n| < \\varepsilon/5$.',
            'Wrong: convergence to $0$ doesn\'t mean exact $0$; it means arbitrarily close.',
            'Wrong: convergence to $0$ means $a_n \\to 0$, not that $a_n < 1$.'
          ]
        },
        {
          question: 'Given $|b_n| \\leq 5$ and $|a_n| < \\varepsilon/5$ for large $n$, what is the bound on $|a_n b_n|$?',
          options: [
            '$|a_n b_n| < \\varepsilon/5$',
            '$|a_n b_n| < \\varepsilon$',
            '$|a_n b_n| < 5\\varepsilon$',
            '$|a_n b_n| \\leq 25$'
          ],
          correct: 1,
          explanations: [
            'Wrong: you need to multiply the bounds by $5$ to get the product bound.',
            'Correct! $|a_n b_n| = |a_n||b_n| < (\\varepsilon/5) \\cdot 5 = \\varepsilon$.',
            'Wrong: you divided rather than multiplied; the bound should shrink, not grow.',
            'Wrong: this bound doesn\'t use the convergence of $a_n$ and depends only on the bound on $b_n$.'
          ]
        },
        {
          question: 'What is the correct conclusion about $a_n b_n$?',
          options: [
            '$a_n b_n \\to 0$',
            '$a_n b_n \\to 5$',
            '$a_n b_n \\to \\infty$',
            '$a_n b_n$ is bounded but might not converge'
          ],
          correct: 0,
          explanations: [
            'Correct! Since $|a_n b_n| < \\varepsilon$ for large $n$ and $\\varepsilon$ is arbitrary, $a_n b_n \\to 0$.',
            'Wrong: if $a_n \\to 0$, then $a_n b_n \\to 0 \\cdot (\\text{anything}) = 0$, not $5$.',
            'Wrong: $|a_n b_n|$ is bounded by $\\varepsilon$, which goes to $0$.',
            'Wrong: the product converges to $0$, not just stays bounded.'
          ]
        }
      ]
    },
    {
      id: 'bp2',
      difficulty: 2,
      statement: 'Use "for $n$ sufficiently large" to simplify an expression: if $a_n = 1 + 1/n$ and you want $|a_n - 1| < 0.1$, what $N$ works?',
      steps: [
        {
          question: 'What is $|a_n - 1|$ in terms of $n$?',
          options: [
            '$|a_n - 1| = 1/n$',
            '$|a_n - 1| = n$',
            '$|a_n - 1| = 1 + 1/n$',
            '$|a_n - 1| = -1/n$'
          ],
          correct: 0,
          explanations: [
            'Correct! Since $a_n = 1 + 1/n$, we have $a_n - 1 = 1/n$, so $|a_n - 1| = 1/n$.',
            'Wrong: this is the reciprocal; $a_n - 1 = 1/n$, not $n$.',
            'Wrong: this is $a_n$ itself, not the difference from the limit $1$.',
            'Wrong: $1/n$ is positive, so the absolute value is $1/n$, not $-1/n$.'
          ]
        },
        {
          question: 'To satisfy $|a_n - 1| < 0.1$, we need $1/n < 0.1$. What condition on $n$ is this equivalent to?',
          options: [
            '$n < 0.1$',
            '$n > 10$',
            '$n > 0.1$',
            '$n < 10$'
          ],
          correct: 1,
          explanations: [
            'Wrong: if $1/n < 0.1$, we divide both sides by $1$ and flip the inequality: $n > 1/0.1 = 10$.',
            'Correct! Rearranging $1/n < 0.1$ gives $n > 10$.',
            'Wrong: this is too weak; we need $n > 10$ to make $1/n$ small enough.',
            'Wrong: this would make $1/n$ large, not small.'
          ]
        },
        {
          question: 'What is the smallest integer $N$ that works (i.e., for all $n > N$, $|a_n - 1| < 0.1$)?',
          options: [
            '$N = 0.1$',
            '$N = 1$',
            '$N = 9$',
            '$N = 10$'
          ],
          correct: 2,
          explanations: [
            'Wrong: $N$ must be an integer.',
            'Wrong: for $n = 1$, we have $1/1 = 1$, which is not less than $0.1$.',
            'Correct! For $n > 9$, we have $n \\geq 10$, so $1/n \\leq 1/10 = 0.1$. Thus $N = 9$ ensures $|a_n - 1| < 0.1$ for all $n > 9$.',
            'Wrong: for $n = 10$, we have $1/n = 0.1$, which is not strictly less than $0.1$. We need $n > 10$, so $N = 10$ doesn\'t guarantee $n > 10$ (only $n \\geq 11$).'
          ]
        }
      ]
    },
    {
      id: 'bp3',
      difficulty: 3,
      statement: 'Squeeze theorem application: show that $n \\cdot \\cos(n)/n^2 \\to 0$ by squeezing it between simpler bounds.',
      steps: [
        {
          question: 'What is the bound on $|\\cos(n)|$ for all $n$?',
          options: [
            '$|\\cos(n)| \\leq 0$',
            '$|\\cos(n)| \\leq 1$',
            '$|\\cos(n)| \\leq n$',
            '$|\\cos(n)| \\leq 2$'
          ],
          correct: 1,
          explanations: [
            'Wrong: cosine is not always $0$.',
            'Correct! The cosine function is bounded: $-1 \\leq \\cos(n) \\leq 1$, so $|\\cos(n)| \\leq 1$.',
            'Wrong: cosine is bounded between $-1$ and $1$, much smaller than $n$ for large $n$.',
            'Wrong: the bound is $\\pm 1$, not $\\pm 2$.'
          ]
        },
        {
          question: 'Using $|\\cos(n)| \\leq 1$, what is an upper bound on $|n \\cdot \\cos(n)/n^2|$?',
          options: [
            '$|n \\cdot \\cos(n)/n^2| \\leq 1/n$',
            '$|n \\cdot \\cos(n)/n^2| \\leq n$',
            '$|n \\cdot \\cos(n)/n^2| \\leq 1$',
            '$|n \\cdot \\cos(n)/n^2| \\leq \\cos(n)$'
          ],
          correct: 0,
          explanations: [
            'Correct! Since $|\\cos(n)| \\leq 1$, we have $|n \\cdot \\cos(n)/n^2| = (n/n^2) \\cdot |\\cos(n)| \\leq (1/n) \\cdot 1 = 1/n$.',
            'Wrong: you need to divide by $n^2$, not multiply.',
            'Wrong: $1/n$ goes to $0$, but $1/n^2$ (which gives the bound $1/n$) is even smaller and still approaches $0$.',
            'Wrong: this doesn\'t simplify the expression to use the convergence of $1/n$.'
          ]
        },
        {
          question: 'What can you conclude about $n \\cdot \\cos(n)/n^2$ using the fact that $1/n \\to 0$ and $0 \\leq |n \\cdot \\cos(n)/n^2| \\leq 1/n$?',
          options: [
            '$n \\cdot \\cos(n)/n^2 \\to 1$',
            '$n \\cdot \\cos(n)/n^2 \\to 0$',
            '$n \\cdot \\cos(n)/n^2 \\to \\infty$',
            '$n \\cdot \\cos(n)/n^2$ is unbounded'
          ],
          correct: 1,
          explanations: [
            'Wrong: the upper bound $1/n \\to 0$, not $1$.',
            'Correct! By the squeeze theorem, since $0 \\leq |n \\cdot \\cos(n)/n^2| \\leq 1/n$ and $1/n \\to 0$, we have $|n \\cdot \\cos(n)/n^2| \\to 0$, so $n \\cdot \\cos(n)/n^2 \\to 0$.',
            'Wrong: the expression is bounded above by $1/n$, which shrinks to $0$.',
            'Wrong: $1/n$ is a strict upper bound that decreases to $0$.'
          ]
        }
      ]
    }
  ]
};


const CH5 = {
  id: 'factoring',
  num: 5,
  title: 'Factoring & Decomposition',
  subtitle: 'Breaking complex expressions into tractable pieces',
  defs: [
    {
      term: 'Difference of Powers Factoring',
      formal: '$a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + a^{n-3}b^2 + \\ldots + b^{n-1})$ for all $n \\in \\mathbb{N}$',
      intuition: 'A high power difference always has a linear factor. This formula shows how to extract the difference in the bases, leaving a sum of cross-products. It\'s like "unraveling" the power through factorization.',
      example: '$x^3 - 8 = x^3 - 2^3 = (x - 2)(x^2 + 2x + 4)$. Or for limits: $(a_n^2 - L^2) = (a_n - L)(a_n + L)$, so if $a_n \\to L$, then $a_n^2 \\to L^2$ since $a_n + L \\to 2L$.'
    },
    {
      term: 'Common Factor Extraction',
      formal: 'Extract the leading term from a sum to isolate dominant behavior: $n^p(f(n) + o(1))$ for polynomial or exponential leading terms',
      intuition: 'When analyzing limits of ratios, pull out the term that "wins" in size (grows fastest). The remaining terms become negligible, making the limit transparent.',
      example: '$n^2 + n = n^2(1 + 1/n)$, so $\\lim (n^2 + n)/(2n^2) = \\lim n^2(1 + 1/n)/(2n^2) = \\lim (1 + 1/n)/2 = 1/2$. The dominant term $n^2$ cancels.'
    },
    {
      term: 'Partial Fraction Decomposition',
      formal: 'A rational function can be written as a sum of simpler fractions: $1/(k(k+1)) = A/k + B/(k+1)$ where $A$ and $B$ are constants.',
      intuition: 'Convert a complicated fraction into pieces you already understand. Often reveals a telescoping structure where consecutive terms cancel.',
      example: '$1/(k(k+1)) = 1/k - 1/(k+1)$. So $\\sum_{k=1}^n 1/(k(k+1)) = \\sum_{k=1}^n (1/k - 1/(k+1)) = 1 - 1/(n+1) \\to 1$ as $n \\to \\infty$.'
    },
    {
      term: 'Completing the Square',
      formal: '$x^2 + bx + c = (x + b/2)^2 - b^2/4 + c = (x + b/2)^2 - (b^2 - 4c)/4$',
      intuition: 'Rewrite a quadratic to expose a perfect square plus a constant. Isolates the minimum or maximum and reveals the quadratic\'s geometry.',
      example: '$x^2 + 2x = (x + 1)^2 - 1$. Or for proving AM-GM: $x^2 + y^2 = (x - y)^2 + 2xy \\geq 2xy$ (since $(x-y)^2 \\geq 0$), so $x^2 + y^2 \\geq 2xy$.'
    }
  ],
  explained: [
    {
      id: 'f1',
      difficulty: 1,
      statement: 'Use the difference of squares formula to simplify $(a_n^2 - L^2)$ and prove: if $a_n \\to L$, then $a_n^2 \\to L^2$.',
      steps: [
        {
          title: 'Factor the difference of squares',
          content: 'Apply $a^n - b^n$ factorization with $n = 2$: $a_n^2 - L^2 = (a_n - L)(a_n + L)$'
        },
        {
          title: 'Bound the second factor',
          content: 'Since $a_n \\to L$, there exists $N$ such that for $n > N$: $|a_n - L| < 1$. This means $L - 1 < a_n < L + 1$, so $a_n + L$ is bounded: $|a_n + L| < 2|L| + 1$ (or some constant $M$).'
        },
        {
          title: 'Combine the bounds',
          content: '$|a_n^2 - L^2| = |a_n - L| \\cdot |a_n + L| < |a_n - L| \\cdot M$. Since $a_n \\to L$, we have $|a_n - L| \\to 0$, so $|a_n^2 - L^2| \\to 0$.'
        },
        {
          title: 'Conclude convergence',
          content: '$|a_n^2 - L^2| \\to 0$ means $a_n^2 \\to L^2$. This completes the proof that squaring preserves limits.'
        }
      ],
      answer: '$a_n^2 - L^2 = (a_n - L)(a_n + L)$. The first factor goes to zero (by hypothesis), and the second factor is bounded (since $a_n \\to L$ stays near $L$). Their product goes to zero, so $a_n^2 \\to L^2$.'
    },
    {
      id: 'f2',
      difficulty: 2,
      statement: 'Factor $n^2 + n$ as $n^2(1 + 1/n)$ and use this to find $\\lim (n^2 + n)/(2n^2 + 3)$ as $n \\to \\infty$.',
      steps: [
        {
          title: 'Extract the common factor from numerator',
          content: '$n^2 + n = n^2(1 + 1/n)$. This isolates the dominant term $n^2$ and shows the remainder $1/n \\to 0$.'
        },
        {
          title: 'Extract the common factor from denominator',
          content: '$2n^2 + 3 = n^2(2 + 3/n^2)$. Similarly, the dominant term is $n^2$ with remainder $3/n^2 \\to 0$.'
        },
        {
          title: 'Simplify the ratio',
          content: '$(n^2 + n)/(2n^2 + 3) = [n^2(1 + 1/n)]/[n^2(2 + 3/n^2)] = (1 + 1/n)/(2 + 3/n^2)$'
        },
        {
          title: 'Take the limit',
          content: '$\\lim (1 + 1/n)/(2 + 3/n^2) = (1 + 0)/(2 + 0) = 1/2$ as $n \\to \\infty$, since $1/n \\to 0$ and $3/n^2 \\to 0$.'
        }
      ],
      answer: '$(n^2 + n)/(2n^2 + 3) = (1 + 1/n)/(2 + 3/n^2) \\to 1/2$ as $n \\to \\infty$.'
    },
    {
      id: 'f3',
      difficulty: 3,
      statement: 'Use partial fraction decomposition to evaluate $\\sum_{k=1}^n 1/(k^2 + 3k + 2)$ as a telescoping sum and find its limit as $n \\to \\infty$.',
      steps: [
        {
          title: 'Factor the denominator',
          content: '$k^2 + 3k + 2 = (k + 1)(k + 2)$. We need to decompose $1/[(k+1)(k+2)]$.'
        },
        {
          title: 'Set up and solve partial fractions',
          content: '$1/[(k+1)(k+2)] = A/(k+1) + B/(k+2)$. Multiply by $(k+1)(k+2)$: $1 = A(k+2) + B(k+1)$. Setting $k = -1$: $1 = A(1)$, so $A = 1$. Setting $k = -2$: $1 = B(-1)$, so $B = -1$. Thus $1/[(k+1)(k+2)] = 1/(k+1) - 1/(k+2)$.'
        },
        {
          title: 'Write out the telescoping sum',
          content: '$\\sum_{k=1}^n [1/(k+1) - 1/(k+2)] = [1/2 - 1/3] + [1/3 - 1/4] + [1/4 - 1/5] + \\ldots + [1/(n+1) - 1/(n+2)]$. Most terms cancel: $= 1/2 - 1/(n+2)$.'
        },
        {
          title: 'Find the limit',
          content: '$\\lim_{n \\to \\infty} [1/2 - 1/(n+2)] = 1/2 - 0 = 1/2$. The sum converges to $1/2$.'
        }
      ],
      answer: '$\\sum_{k=1}^n 1/(k^2 + 3k + 2) = 1/2 - 1/(n+2) \\to 1/2$ as $n \\to \\infty$, achieved by decomposing $1/[(k+1)(k+2)] = 1/(k+1) - 1/(k+2)$ and observing the telescoping.'
    },
    {
      id: 'f4',
      difficulty: 4,
      statement: 'Factor $x^n - y^n$ to prove that if $a_n \\to L$, then $a_n^n \\to L^n$ for fixed $n \\in \\mathbb{N}$.',
      steps: [
        {
          title: 'Apply the difference of powers formula',
          content: '$a_n^n - L^n = (a_n - L)(a_n^{n-1} + a_n^{n-2}L + a_n^{n-3}L^2 + \\ldots + L^{n-1})$ by the factorization $a^n - b^n = (a - b) \\cdot$(sum of cross-products).'
        },
        {
          title: 'Bound the second factor',
          content: 'Since $a_n \\to L$, there exists $N$ such that for $n > N$: $|a_n - L| < 1$, so $|a_n| < |L| + 1$. The sum has $n$ terms, each bounded by $(|L| + 1)^{n-1}$ in absolute value. Thus $|a_n^{n-1} + \\ldots + L^{n-1}| \\leq n(|L| + 1)^{n-1} =: M$ (a fixed multiple for large $n$).'
        },
        {
          title: 'Combine bounds',
          content: '$|a_n^n - L^n| = |a_n - L| \\cdot |a_n^{n-1} + \\ldots + L^{n-1}| \\leq |a_n - L| \\cdot M$. Since $a_n \\to L$, we have $|a_n - L| \\to 0$, so $|a_n^n - L^n| \\to 0$.'
        },
        {
          title: 'Conclude',
          content: '$|a_n^n - L^n| \\to 0$, hence $a_n^n \\to L^n$. This proves that continuous functions like $f(x) = x^n$ preserve limits.'
        }
      ],
      answer: 'The factorization $a_n^n - L^n = (a_n - L) \\cdot P(a_n, L)$ where $P$ is a polynomial sum bounded as $a_n$ stays near $L$. Since the first factor $a_n - L \\to 0$ and the second is bounded, their product $\\to 0$, giving $a_n^n \\to L^n$.'
    },
    {
      id: 'f5',
      difficulty: 5,
      statement: 'Complete the square to prove $x^2 + y^2 \\geq 2xy$, and use this to show $(a + b)^2 \\geq 4ab$ for positive $a, b$.',
      steps: [
        {
          title: 'Rearrange and complete the square',
          content: '$x^2 + y^2 - 2xy = x^2 - 2xy + y^2 = (x - y)^2$. Since $(x - y)^2 \\geq 0$ for all real $x, y$, we have $x^2 + y^2 - 2xy \\geq 0$, so $x^2 + y^2 \\geq 2xy$.'
        },
        {
          title: 'Apply to $(a + b)^2$',
          content: 'Expand: $(a + b)^2 = a^2 + 2ab + b^2$. From the inequality above with $x = a$ and $y = b$: $a^2 + b^2 \\geq 2ab$, so $(a + b)^2 = a^2 + 2ab + b^2 \\geq 2ab + 2ab = 4ab$.'
        },
        {
          title: 'Interpret the result',
          content: '$(a + b)^2 \\geq 4ab$ is equivalent to $(a + b)/2 \\geq \\sqrt{ab}$, the AM-GM inequality for two positive numbers. The arithmetic mean dominates the geometric mean.'
        },
        {
          title: 'Use in limits context',
          content: 'If $a_n \\to L$ and $b_n \\to M$ both positive, then $(a_n + b_n)^2 \\geq 4a_nb_n$ for all $n$. Taking limits: $(L + M)^2 \\geq 4LM$, proving the AM-GM inequality in the limit.'
        }
      ],
      answer: 'The inequality $x^2 + y^2 \\geq 2xy$ follows from $(x - y)^2 \\geq 0$. Applying $x = a, y = b$ and expanding $(a+b)^2$ yields $(a+b)^2 \\geq 4ab$, the AM-GM inequality. This plays a key role in bounding convergent sequences.'
    }
  ],
  practice: [
    {
      id: 'fp1',
      difficulty: 2,
      statement: 'Factor $a_n^3 - L^3$ to prove that if $a_n \\to L$, then $a_n^3 \\to L^3$.',
      steps: [
        {
          question: 'Which factorization applies to $a_n^3 - L^3$?',
          options: [
            '$(a_n - L)(a_n^2 + a_nL + L^2)$',
            '$(a_n - L)^3$',
            '$(a_n - L)(a_n + L)^2$',
            '$a_n(a_n^2 - L^2) - L^3$'
          ],
          correct: 0,
          explanations: [
            'Correct! This is $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$, so $a_n^3 - L^3 = (a_n - L)(a_n^2 + a_nL + L^2)$.',
            'Wrong. $(a_n - L)^3$ expands to $a_n^3 - 3a_n^2L + 3a_nL^2 - L^3$, which is not equal to $a_n^3 - L^3$.',
            'Wrong. $(a_n - L)(a_n + L)^2 = (a_n - L)(a_n^2 + 2a_nL + L^2)$, which is not the correct factorization for the difference of cubes.',
            'Wrong. This is a partial factorization but not the standard form. The correct form isolates $(a_n - L)$ as a single factor.'
          ]
        },
        {
          question: 'If $a_n \\to L$, which term in $(a_n - L)(a_n^2 + a_nL + L^2)$ goes to zero?',
          options: [
            'The term $(a_n - L)$ goes to zero; the sum $(a_n^2 + a_nL + L^2)$ stays bounded near $3L^2$.',
            'The entire product goes to zero immediately.',
            'Both factors must go to zero simultaneously.',
            'Only $a_n^2$ goes to zero in the second factor.'
          ],
          correct: 0,
          explanations: [
            'Correct! Since $a_n \\to L$, we have $a_n - L \\to 0$. The second factor $a_n^2 + a_nL + L^2$ approaches $L^2 + L \\cdot L + L^2 = 3L^2$ (a bounded constant). So the product $\\to 0 \\cdot $(finite)$ = 0$.',
            'Wrong. The product approaches $0 \\cdot $(bounded constant)$ = 0$, but it\'s specifically the first factor that vanishes.',
            'Wrong. The second factor does not go to zero; it approaches $3L^2$. Only the first factor vanishes.',
            'Wrong. In the second factor, $a_n^2 \\to L^2$, not $0$, and $L$ is a fixed constant. The second factor as a whole stays bounded.'
          ]
        },
        {
          question: 'What is the conclusion from $|a_n^3 - L^3| = |a_n - L| \\cdot |a_n^2 + a_nL + L^2|$ with the bounds above?',
          options: [
            'Since $|a_n - L| \\to 0$ and $|a_n^2 + a_nL + L^2|$ is bounded by $3L^2 + \\varepsilon$ for small $\\varepsilon$, we have $|a_n^3 - L^3| \\to 0$, so $a_n^3 \\to L^3$.',
            'The product can never go to zero because $L \\neq 0$.',
            'We need to show that both factors go to zero separately.',
            'The inequality does not provide enough information to conclude convergence.'
          ],
          correct: 0,
          explanations: [
            'Correct! The product of a term $\\to 0$ and a bounded term is $0$. Therefore $|a_n^3 - L^3| \\to 0$, which means $a_n^3 \\to L^3$. This is a standard technique: a vanishing factor times a bounded factor vanishes.',
            'Wrong. The fact that $L \\neq 0$ is irrelevant; the second factor remains bounded either way. A bounded factor times a vanishing factor still vanishes.',
            'Wrong. Only the first factor needs to vanish. A term going to zero multiplied by any bounded constant also goes to zero.',
            'Wrong. The factorization and bounds together are sufficient. We have a rigorous squeeze-type argument: $0 \\leq |a_n^3 - L^3| \\leq |a_n - L| \\cdot M \\to 0$.'
          ]
        }
      ]
    },
    {
      id: 'fp2',
      difficulty: 2,
      statement: 'Extract the dominant term from $(3n^2 + 5n)/(n^2 - 2)$ and evaluate the limit as $n \\to \\infty$.',
      steps: [
        {
          question: 'What is the dominant (leading) term in the numerator $3n^2 + 5n$?',
          options: [
            '$3n^2$ (the highest degree term)',
            '$5n$ (the linear term)',
            'Both equally, since $3 > 5$ is false',
            'The denominator overrides the numerator\'s dominance'
          ],
          correct: 0,
          explanations: [
            'Correct! For large $n$, the term $3n^2$ grows much faster than $5n$ (quadratic beats linear). So $3n^2 + 5n \\approx 3n^2$ for large $n$.',
            'Wrong. The linear term $5n$ grows slower than the quadratic $3n^2$. Quadratic terms dominate linear terms.',
            'Wrong. The dominance is determined by the degree (power of $n$), not the coefficient. The $n^2$ term dominates.',
            'Wrong. We first simplify the numerator and denominator separately before comparing them.'
          ]
        },
        {
          question: 'Factor out $n^2$ from both numerator and denominator to rewrite the fraction.',
          options: [
            '$(3 + 5/n)/(1 - 2/n^2)$',
            '$(3n + 5)/(n - 2/n)$',
            '$3n^2(1 + 5/3n) / n^2(1 - 2/n^2) = (1 + 5/3n)/(1 - 2/n^2)$',
            '$(3 + 5/n) / (1 + 2/n^2)$'
          ],
          correct: 0,
          explanations: [
            'Correct! $(3n^2 + 5n)/(n^2 - 2) = [n^2(3 + 5/n)]/[n^2(1 - 2/n^2)] = (3 + 5/n)/(1 - 2/n^2)$. The $n^2$ factors cancel.',
            'Wrong. This extracts $n$ from the numerator only, leaving $n$ in the denominator. We need to factor $n^2$ from both.',
            'Wrong. While the final form $(1 + 5/3n)/(1 - 2/n^2)$ is correct after canceling $n^2$, the intermediate step shown is redundant and confusing.',
            'Wrong. The denominator should be $(1 - 2/n^2)$, not $(1 + 2/n^2)$. Factoring $n^2$ from $n^2 - 2$ gives $n^2(1 - 2/n^2)$.'
          ]
        },
        {
          question: 'What is $\\lim (3 + 5/n)/(1 - 2/n^2)$ as $n \\to \\infty$?',
          options: [
            '$3$ (since $5/n \\to 0$ and $2/n^2 \\to 0$, leaving $3/1 = 3$)',
            '$5/2$ (the ratio of the linear coefficient to the constant)',
            '$\\infty$ (the numerator is larger)',
            '$1$ (the middle term dominates)'
          ],
          correct: 0,
          explanations: [
            'Correct! As $n \\to \\infty$, we have $5/n \\to 0$ and $2/n^2 \\to 0$. So $(3 + 5/n)/(1 - 2/n^2) \\to (3 + 0)/(1 - 0) = 3/1 = 3$.',
            'Wrong. The ratio $5/2$ was perhaps guessed, but $5$ is a coefficient in the linear term, not the leading term. Leading terms dominate, and $3$ is the leading coefficient.',
            'Wrong. The limit is finite, not infinite. Both the numerator and denominator have the same degree ($n^2$), so the ratio approaches a finite number.',
            'Wrong. There is no "middle term" dominance here. As $n \\to \\infty$, the lower-order terms ($5/n$ and $2/n^2$) vanish, leaving the ratio of leading coefficients: $3/1 = 3$.'
          ]
        }
      ]
    },
    {
      id: 'fp3',
      difficulty: 3,
      statement: 'Apply partial fraction decomposition to $1/(k(k+2))$ and use it to evaluate $\\sum_{k=1}^n 1/(k(k+2))$ as a telescoping series.',
      steps: [
        {
          question: 'Set up the partial fraction decomposition for $1/(k(k+2))$. What are $A$ and $B$ in $1/(k(k+2)) = A/k + B/(k+2)$?',
          options: [
            '$A = 1/2, B = -1/2$',
            '$A = 1, B = 1$',
            '$A = -1/2, B = 1/2$',
            '$A = 2, B = -2$'
          ],
          correct: 0,
          explanations: [
            'Correct! Multiply by $k(k+2)$: $1 = A(k+2) + Bk$. Set $k = 0$: $1 = 2A$, so $A = 1/2$. Set $k = -2$: $1 = -2B$, so $B = -1/2$.',
            'Wrong. With $A = 1$ and $B = 1$, we get $k(k+2) = k + (k+2) = 2k + 2$ in the denominator, which doesn\'t equal $1$ when cleared.',
            'Wrong. The signs are flipped. Check: with $A = -1/2$ and $B = 1/2$, at $k = 0$ we get $1 = -1/2 \\cdot 2 = -1$, which is false.',
            'Wrong. With $A = 2$ and $B = -2$, the numerator becomes $2(k+2) - 2k = 4$, not $1$.'
          ]
        },
        {
          question: 'Rewrite the sum $\\sum_{k=1}^n 1/(k(k+2))$ using the decomposition $1/(k(k+2)) = (1/2)[1/k - 1/(k+2)]$.',
          options: [
            '$(1/2)\\sum_{k=1}^n [1/k - 1/(k+2)]$',
            '$\\sum_{k=1}^n [1/k - 1/(k+2)]$',
            '$(1/2)\\sum_{k=1}^n [1/k + 1/(k+2)]$',
            '$\\sum_{k=1}^n 1/k \\cdot 1/(k+2)$'
          ],
          correct: 0,
          explanations: [
            'Correct! Factor out the $1/2$ and expand the sum: $(1/2)[1/1 - 1/3 + 1/2 - 1/4 + 1/3 - 1/5 + \\ldots + 1/n - 1/(n+2)]$.',
            'Wrong. The factor $1/2$ must be included from the decomposition. You cannot drop it.',
            'Wrong. The decomposition has a minus sign, not a plus sign: $1/(k(k+2)) = (1/2)[1/k - 1/(k+2)]$, not $(1/2)[1/k + 1/(k+2)]$.',
            'Wrong. This is a product of fractions, not a sum. The partial fraction decomposition gives a difference (subtraction).'
          ]
        },
        {
          question: 'Write out the first few and last few terms of $(1/2)\\sum_{k=1}^n [1/k - 1/(k+2)]$ to identify which terms survive (telescoping).',
          options: [
            '$(1/2)[1 + 1/2 - 1/(n+1) - 1/(n+2)]$',
            '$(1/2)[1 - 1/(n+2)]$',
            '$(1/2)[1 + 1/2 - 1/n - 1/(n+1)]$',
            '$(1/2)[2n - 1]$'
          ],
          correct: 0,
          explanations: [
            'Correct! The sum telescopes: $(1/2)[1/1 - 1/3 + 1/2 - 1/4 + 1/3 - 1/5 + \\ldots]$. The $1/3$ from $k=1$ cancels with $-1/3$ from $k=3$, etc. What survives: $1 + 1/2$ from the start and $-1/(n+1) - 1/(n+2)$ from the end.',
            'Wrong. This is incomplete. The first two positive terms $1$ and $1/2$ don\'t cancel with anything; they survive. Include them.',
            'Wrong. This misses $1/2$ and includes $1/n$ which actually cancels. Trace through carefully: $k=1$ gives $1/1 - 1/3$; $k=2$ gives $1/2 - 1/4$; $k=n$ gives $1/n - 1/(n+2)$.',
            'Wrong. This is a formula, not a telescoping expansion. Telescoping sums leave specific surviving terms, not a linear formula in $n$.'
          ]
        }
      ]
    }
  ]
};

const CH6 = {
  id: 'substitution',
  num: 6,
  title: 'Strategic Substitution',
  subtitle: 'Changing variables to simplify the battlefield',
  defs: [
    {
      term: 'The Reciprocal Substitution',
      formal: 'For sequences $\\{a_n\\}$ with $n \\to \\infty$, substitute $h = 1/n$ (so $h \\to 0^+$). Convert sequence limits to function limits: $\\lim_{n \\to \\infty} f(n) = \\lim_{h \\to 0^+} f(1/h)$.',
      intuition: 'As $n$ grows large ($n \\to \\infty$), the reciprocal $h = 1/n$ shrinks ($h \\to 0$). This "inverts" the behavior and often converts complicated sequence problems into familiar function limits near zero.',
      example: '$\\lim_{n \\to \\infty} (1 + 1/n)^n$. Substitute $h = 1/n$, so $n = 1/h$ and $(1 + h)^{1/h}$. Now as $n \\to \\infty$, $h \\to 0^+$, and we ask for $\\lim_{h \\to 0^+} (1 + h)^{1/h}$, a classic limit equaling $e$.'
    },
    {
      term: 'Centering at the Limit',
      formal: 'If $a_n \\to L$, define $\\varepsilon_n = a_n - L$ so $a_n = L + \\varepsilon_n$ with $\\varepsilon_n \\to 0$. Rewrite expressions in terms of $\\varepsilon_n$ to expose the convergence.',
      intuition: 'Instead of thinking of $a_n$ as an arbitrary sequence approaching $L$, explicitly track the error $\\varepsilon_n$ from the limit. This isolates the "deviation" and makes algebraic manipulations clearer.',
      example: 'Prove $\\sqrt{a_n} \\to \\sqrt{L}$ for $a_n \\to L > 0$. Write $a_n = L + \\varepsilon_n$, so $\\sqrt{a_n} - \\sqrt{L} = (\\sqrt{L+\\varepsilon_n} - \\sqrt{L})$. Rationalize: multiply by $(\\sqrt{L+\\varepsilon_n} + \\sqrt{L}) / (\\sqrt{L+\\varepsilon_n} + \\sqrt{L})$ to get $\\varepsilon_n / (\\sqrt{L+\\varepsilon_n} + \\sqrt{L}) \\to 0$ as $\\varepsilon_n \\to 0$.'
    },
    {
      term: 'Exponential-Log Bridge',
      formal: 'To handle expressions $a_n^{b_n}$, write $a_n^{b_n} = \\exp(b_n \\ln(a_n))$. Converts multiplication (the exponent $b_n$ times $a_n$) into the product $b_n \\ln(a_n)$, which may telescope or simplify via Taylor series.',
      intuition: 'Exponentials and logs are "dual" operations that convert products into sums and exponents into products. Use them to linearize complicated power expressions, especially with exponential growth.',
      example: '$(1 + 3/n)^n = \\exp(n \\ln(1 + 3/n))$. For large $n$, $\\ln(1 + 3/n) \\approx 3/n$ (Taylor series), so $n \\ln(1 + 3/n) \\approx 3$, giving $(1 + 3/n)^n \\to e^3$.'
    },
    {
      term: 'Change of Index',
      formal: 'For sums or sequences with awkward indexing, re-index by substituting $j = f(k)$ (e.g., $j = n - k$ or $j = k - 1$). Transform $\\sum_k$ to $\\sum_j$ with simpler limits or a clearer pattern.',
      intuition: 'Indexing is a labeling choice. By relabeling (e.g., counting from the end instead of the start), you can reveal hidden structure, combine sums, or expose telescoping.',
      example: 'The double sum $\\sum_{k=1}^n \\sum_{j=k}^n a_j$ (sum over all pairs $(k, j)$ with $1 \\leq k \\leq j \\leq n$) can be reindexed to $\\sum_{j=1}^n \\sum_{k=1}^j a_j$ by swapping the order of summation, which may be easier to compute.'
    }
  ],
  explained: [
    {
      id: 's1',
      difficulty: 1,
      statement: 'Evaluate $\\lim_{n \\to \\infty} (1 + 1/n)^n$ by substituting $h = 1/n$ and using the exponential-log bridge.',
      steps: [
        {
          title: 'Apply the reciprocal substitution',
          content: 'Let $h = 1/n$. As $n \\to \\infty$, $h \\to 0^+$. Also, $n = 1/h$, so $(1 + 1/n)^n = (1 + h)^{1/h}$.'
        },
        {
          title: 'Use the exponential-log bridge',
          content: '$(1 + h)^{1/h} = \\exp((1/h) \\ln(1 + h)) = \\exp(\\ln(1 + h) / h)$. Now we need to find $\\lim_{h \\to 0} \\ln(1 + h) / h$.'
        },
        {
          title: 'Apply L\'Hôpital or Taylor series',
          content: 'By L\'Hôpital\'s rule: $\\lim_{h \\to 0} \\ln(1 + h) / h = \\lim_{h \\to 0} [1/(1+h)] / 1 = 1$. Alternatively, Taylor: $\\ln(1 + h) = h - h^2/2 + h^3/3 - \\ldots$, so $\\ln(1 + h) / h = 1 - h/2 + h^2/3 - \\ldots \\to 1$.'
        },
        {
          title: 'Exponentiate to find the limit',
          content: 'Since $\\ln(1 + h) / h \\to 1$, we have $\\exp(\\ln(1 + h) / h) \\to \\exp(1) = e$. Therefore, $(1 + 1/n)^n \\to e$ as $n \\to \\infty$.'
        }
      ],
      answer: 'By substituting $h = 1/n$, the expression becomes $(1 + h)^{1/h}$. Taking logs: $(1/h) \\ln(1 + h)$. As $h \\to 0$, $\\ln(1 + h) / h \\to 1$ (by Taylor or L\'Hôpital). Thus $\\exp(1) = e$.'
    },
    {
      id: 's2',
      difficulty: 2,
      statement: 'Prove that $(1 + x/n)^n \\to e^x$ as $n \\to \\infty$ using the exponential-log bridge and Taylor approximation $\\ln(1 + y) \\approx y$.',
      steps: [
        {
          title: 'Apply the exponential-log bridge',
          content: '$(1 + x/n)^n = \\exp(n \\ln(1 + x/n))$. We need to evaluate $\\lim_{n \\to \\infty} n \\ln(1 + x/n)$.'
        },
        {
          title: 'Substitute $y = x/n$ and use Taylor',
          content: 'As $n \\to \\infty$, $y = x/n \\to 0$. By Taylor series, $\\ln(1 + y) = y - y^2/2 + y^3/3 - \\ldots \\approx y$ for small $y$. So $\\ln(1 + x/n) \\approx x/n$ (keeping only the leading term).'
        },
        {
          title: 'Multiply by $n$',
          content: '$n \\ln(1 + x/n) \\approx n \\cdot (x/n) = x$. More precisely, $n \\ln(1 + x/n) = n[x/n - (x/n)^2/2 + O((x/n)^3)] = x - x^2/(2n) + O(x^3/n^2) \\to x$ as $n \\to \\infty$.'
        },
        {
          title: 'Exponentiate',
          content: '$(1 + x/n)^n = \\exp(n \\ln(1 + x/n)) \\to \\exp(x) = e^x$ as $n \\to \\infty$.'
        }
      ],
      answer: 'Writing $(1 + x/n)^n = \\exp(n \\ln(1 + x/n))$ and using $\\ln(1 + x/n) \\approx x/n$, we get $n \\ln(1 + x/n) \\to x$. Thus $(1 + x/n)^n \\to e^x$.'
    },
    {
      id: 's3',
      difficulty: 3,
      statement: 'Use the substitution $\\varepsilon_n = a_n - L$ (centering at the limit) to prove: if $a_n \\to L > 0$, then $\\sqrt{a_n} \\to \\sqrt{L}$.',
      steps: [
        {
          title: 'Set up the centered substitution',
          content: 'Write $a_n = L + \\varepsilon_n$ where $\\varepsilon_n = a_n - L$. Since $a_n \\to L$, we have $\\varepsilon_n \\to 0$. Thus $\\sqrt{a_n} = \\sqrt{L + \\varepsilon_n}$.'
        },
        {
          title: 'Express the error in the limit',
          content: '$\\sqrt{a_n} - \\sqrt{L} = \\sqrt{L + \\varepsilon_n} - \\sqrt{L}$. To simplify, rationalize by multiplying by the conjugate $(\\sqrt{L + \\varepsilon_n} + \\sqrt{L}) / (\\sqrt{L + \\varepsilon_n} + \\sqrt{L})$.'
        },
        {
          title: 'Rationalize and simplify',
          content: '$(\\sqrt{L + \\varepsilon_n} - \\sqrt{L}) \\cdot (\\sqrt{L + \\varepsilon_n} + \\sqrt{L}) / (\\sqrt{L + \\varepsilon_n} + \\sqrt{L}) = [(L + \\varepsilon_n) - L] / (\\sqrt{L + \\varepsilon_n} + \\sqrt{L}) = \\varepsilon_n / (\\sqrt{L + \\varepsilon_n} + \\sqrt{L})$.'
        },
        {
          title: 'Take the limit',
          content: 'As $n \\to \\infty$, $\\varepsilon_n \\to 0$, so $\\sqrt{L + \\varepsilon_n} \\to \\sqrt{L}$. Thus $\\sqrt{L + \\varepsilon_n} + \\sqrt{L} \\to 2\\sqrt{L}$ (a positive constant). Therefore, $|\\sqrt{a_n} - \\sqrt{L}| = |\\varepsilon_n| / |\\sqrt{L + \\varepsilon_n} + \\sqrt{L}| \\to 0 / (2\\sqrt{L}) = 0$, so $\\sqrt{a_n} \\to \\sqrt{L}$.'
        }
      ],
      answer: 'Centering at $L$: write $a_n = L + \\varepsilon_n$, so $\\sqrt{a_n} - \\sqrt{L} = \\varepsilon_n / (\\sqrt{L + \\varepsilon_n} + \\sqrt{L})$. As $\\varepsilon_n \\to 0$, the denominator stays $\\geq \\sqrt{L}$ (bounded away from 0), and the numerator $\\to 0$. Thus $\\sqrt{a_n} \\to \\sqrt{L}$.'
    },
    {
      id: 's4',
      difficulty: 4,
      statement: 'Re-index the double sum $\\sum_{k=1}^n \\sum_{j=k}^n a_j$ by switching the order of summation to $\\sum_{j=1}^n \\sum_{k=1}^j a_j$ and verify they are equal.',
      steps: [
        {
          title: 'Identify the region of summation',
          content: 'The original sum $\\sum_{k=1}^n \\sum_{j=k}^n a_j$ sums over all pairs $(k, j)$ with $1 \\leq k \\leq n$ and $k \\leq j \\leq n$. Geometrically, this is the upper-right triangle: $\\{(k,j) : 1 \\leq k \\leq j \\leq n\\}$.'
        },
        {
          title: 'Rewrite by fixing $j$ first',
          content: 'Instead of summing over $j$ for each $k$, fix $j$ and sum over all $k \\leq j$. For each $j \\in \\{1, \\ldots, n\\}$, the values of $k$ range from $1$ to $j$ (since we need $k \\leq j$). This gives $\\sum_{j=1}^n \\sum_{k=1}^j a_j$.'
        },
        {
          title: 'Verify the ranges match',
          content: 'Original: for $k \\in \\{1,\\ldots,n\\}$, include $j \\in \\{k,\\ldots,n\\}$. This hits the pair $(k,j)$ once per $k$ and $j$ with $k \\leq j$. New: for $j \\in \\{1,\\ldots,n\\}$, include $k \\in \\{1,\\ldots,j\\}$. This hits the same pair $(k,j)$ once per $j$ and $k$ with $k \\leq j$. Same set of pairs, same count.'
        },
        {
          title: 'Simplify using the factor $a_j$',
          content: 'In $\\sum_{j=1}^n \\sum_{k=1}^j a_j$, note that $a_j$ does not depend on $k$. So $\\sum_{k=1}^j a_j = a_j \\cdot j$ (summing $a_j$ exactly $j$ times). Thus $\\sum_{j=1}^n \\sum_{k=1}^j a_j = \\sum_{j=1}^n j \\cdot a_j$. This is often a much simpler form to work with.'
        }
      ],
      answer: 'The region $\\{1 \\leq k \\leq j \\leq n\\}$ can be traversed by summing $j \\in \\{1,\\ldots,n\\}$ first, then $k \\in \\{1,\\ldots,j\\}$ for each $j$. Since $a_j$ is constant in $k$, $\\sum_{j=1}^n \\sum_{k=1}^j a_j = \\sum_{j=1}^n j \\cdot a_j$.'
    },
    {
      id: 's5',
      difficulty: 5,
      statement: 'Use the reciprocal substitution $h = 1/n$ to evaluate $\\lim_{n \\to \\infty} n \\sin(1/n)$ and show it equals $1$.',
      steps: [
        {
          title: 'Set up the reciprocal substitution',
          content: 'Let $h = 1/n$, so $n = 1/h$. As $n \\to \\infty$, $h \\to 0^+$. The expression becomes $n \\sin(1/n) = (1/h) \\sin(h) = \\sin(h) / h$.'
        },
        {
          title: 'Recognize the standard limit',
          content: 'The limit $\\lim_{h \\to 0} \\sin(h) / h$ is a fundamental limit in calculus, equal to $1$. This can be proven using L\'Hôpital\'s rule or geometric arguments about the unit circle.'
        },
        {
          title: 'Apply L\'Hôpital (optional verification)',
          content: 'Both numerator $\\sin(h)$ and denominator $h$ approach $0$ as $h \\to 0^+$, so we have a $0/0$ form. By L\'Hôpital: $\\lim_{h \\to 0} \\sin(h) / h = \\lim_{h \\to 0} \\cos(h) / 1 = \\cos(0) / 1 = 1$.'
        },
        {
          title: 'Conclude the original limit',
          content: 'Since $\\sin(h) / h \\to 1$ as $h \\to 0^+$, and our substitution $h = 1/n$ converts $n \\sin(1/n)$ into $\\sin(h) / h$, we have $\\lim_{n \\to \\infty} n \\sin(1/n) = 1$.'
        }
      ],
      answer: 'With $h = 1/n$, the expression $n \\sin(1/n)$ becomes $\\sin(h) / h$ where $h \\to 0^+$. The standard limit $\\lim_{h \\to 0} \\sin(h)/h = 1$ directly gives the result.'
    }
  ],
  practice: [
    {
      id: 'sp1',
      difficulty: 2,
      statement: 'Apply the exponential-log bridge to find $\\lim_{n \\to \\infty} (1 + 3/n)^n$.',
      steps: [
        {
          question: 'Rewrite $(1 + 3/n)^n$ using the exponential-log bridge.',
          options: [
            '$(1 + 3/n)^n = \\exp(n \\ln(1 + 3/n))$',
            '$(1 + 3/n)^n = \\exp(\\ln(1 + 3/n) / n)$',
            '$(1 + 3/n)^n = \\ln(n(1 + 3/n))$',
            '$(1 + 3/n)^n = n \\exp(\\ln(1 + 3/n))$'
          ],
          correct: 0,
          explanations: [
            'Correct! The exponential-log bridge states $a^n = \\exp(n \\ln(a))$. Here $a = 1 + 3/n$, so $(1 + 3/n)^n = \\exp(n \\ln(1 + 3/n))$.',
            'Wrong. The exponent and logarithm are in the wrong positions. It should be $n$ multiplying the logarithm, not dividing it.',
            'Wrong. The $\\ln$ function produces a number, not an exponential. The structure is $\\exp(\\text{something})$, not $\\ln(\\text{something})$.',
            'Wrong. The factor $n$ should be inside the logarithm (multiplying it), not outside the exponential.'
          ]
        },
        {
          question: 'Using Taylor series, approximate $\\ln(1 + 3/n)$ for large $n$.',
          options: [
            '$\\ln(1 + 3/n) \\approx 3/n$ for large $n$',
            '$\\ln(1 + 3/n) \\approx 1 + 3/n$',
            '$\\ln(1 + 3/n) \\approx 3/n - (3/n)^2/2 + \\ldots \\approx 3/n$ for the leading term',
            '$\\ln(1 + 3/n) \\approx 3$ for all $n$'
          ],
          correct: 0,
          explanations: [
            'Correct! The Taylor series $\\ln(1 + x) = x - x^2/2 + x^3/3 - \\ldots$ with $x = 3/n$ gives $\\ln(1 + 3/n) \\approx 3/n$ for large $n$ (the higher-order terms vanish).',
            'Wrong. $\\ln(1 + 3/n)$ is not linear in $3/n$. The Taylor series starts with $3/n$ as the leading term, but $1 + 3/n$ is under the $\\ln$, not multiplying it.',
            'Wrong. While this mentions the Taylor series, it\'s incomplete. The point is that for large $n$, we can approximate using just the leading term $3/n$.',
            'Wrong. The argument $3/n$ goes to $0$ as $n \\to \\infty$, so $\\ln(1 + 3/n) \\to \\ln(1) = 0$, not $3$.'
          ]
        },
        {
          question: 'Evaluate $n \\ln(1 + 3/n)$ as $n \\to \\infty$.',
          options: [
            '$n \\ln(1 + 3/n) \\approx n \\cdot (3/n) = 3$, so the limit is $3$',
            '$n \\ln(1 + 3/n) \\to \\infty$ since $n$ grows without bound',
            '$n \\ln(1 + 3/n) \\to 0$ since $\\ln(1 + 3/n) \\to 0$',
            '$n \\ln(1 + 3/n) \\approx 3n$, so the limit is $\\infty$'
          ],
          correct: 0,
          explanations: [
            'Correct! Using $\\ln(1 + 3/n) \\approx 3/n$, we have $n \\ln(1 + 3/n) \\approx n \\cdot (3/n) = 3$. The factor of $n$ cancels with the $1/n$, giving a finite limit of $3$.',
            'Wrong. Although $n$ grows, the logarithm shrinks as $3/n \\to 0$, and their product balances to a finite value.',
            'Wrong. While it\'s true that $\\ln(1 + 3/n) \\to 0$, multiplying by $n$ (which grows) can still give a finite limit. The product $n \\cdot (3/n) = 3$.',
            'Wrong. With $\\ln(1 + 3/n) \\approx 3/n$, we get $n \\cdot (3/n) = 3$, not $3n$. The $1/n$ in the logarithm cancels with $n$.'
          ]
        }
      ]
    },
    {
      id: 'sp2',
      difficulty: 2,
      statement: 'Use the substitution $\\varepsilon_n = a_n - L$ (centering at the limit) to verify that if $a_n \\to 2$, then $a_n^2 \\to 4$.',
      steps: [
        {
          question: 'Express $a_n^2 - 4$ in terms of $\\varepsilon_n$, where $\\varepsilon_n = a_n - 2$.',
          options: [
            '$a_n^2 - 4 = (2 + \\varepsilon_n)^2 - 4 = 4 + 4\\varepsilon_n + \\varepsilon_n^2 - 4 = 4\\varepsilon_n + \\varepsilon_n^2$',
            '$a_n^2 - 4 = a_n \\cdot 4 - 4$',
            '$a_n^2 - 4 = \\varepsilon_n^2$',
            '$a_n^2 - 4 = 2\\varepsilon_n$'
          ],
          correct: 0,
          explanations: [
            'Correct! Substitute $a_n = 2 + \\varepsilon_n$: $a_n^2 = (2 + \\varepsilon_n)^2 = 4 + 4\\varepsilon_n + \\varepsilon_n^2$. So $a_n^2 - 4 = 4\\varepsilon_n + \\varepsilon_n^2 = \\varepsilon_n(4 + \\varepsilon_n)$.',
            'Wrong. Multiplying $a_n \\cdot 4$ gives $4a_n$, not $a_n^2$. The expression should come from squaring $2 + \\varepsilon_n$.',
            'Wrong. This drops the $4\\varepsilon_n$ term. Expanding $(2 + \\varepsilon_n)^2 = 4 + 4\\varepsilon_n + \\varepsilon_n^2$, not just $\\varepsilon_n^2$.',
            'Wrong. This ignores the quadratic term $\\varepsilon_n^2$ and misses the factor of $4$ in front of $\\varepsilon_n$. The correct form is $4\\varepsilon_n + \\varepsilon_n^2$.'
          ]
        },
        {
          question: 'Since $a_n \\to 2$, what happens to $\\varepsilon_n$ as $n \\to \\infty$?',
          options: [
            '$\\varepsilon_n \\to 0$ (since $\\varepsilon_n = a_n - 2$ and $a_n \\to 2$)',
            '$\\varepsilon_n \\to 2$ (same as $a_n$)',
            '$\\varepsilon_n$ remains constant',
            '$\\varepsilon_n \\to -2$ (opposite sign)'
          ],
          correct: 0,
          explanations: [
            'Correct! By definition, $\\varepsilon_n = a_n - 2$. If $a_n \\to 2$, then $a_n - 2 \\to 0$, so $\\varepsilon_n \\to 0$.',
            'Wrong. $\\varepsilon_n$ is the deviation (error) from the limit, not the sequence itself. Since $a_n \\to 2$, we have $a_n - 2 \\to 0$.',
            'Wrong. If $\\varepsilon_n$ were constant, then $a_n = 2 + \\varepsilon_n$ would be constant, contradicting $a_n \\to 2$.',
            'Wrong. The sign of $\\varepsilon_n$ is not opposite to $2$. Rather, $\\varepsilon_n$ measures how far $a_n$ is from $2$, and this distance shrinks to $0$.'
          ]
        },
        {
          question: 'Evaluate $|a_n^2 - 4| = |4\\varepsilon_n + \\varepsilon_n^2|$ as $n \\to \\infty$. Which statement is correct?',
          options: [
            '$|4\\varepsilon_n + \\varepsilon_n^2| \\leq |4\\varepsilon_n| + |\\varepsilon_n^2| = 4|\\varepsilon_n| + \\varepsilon_n^2 \\to 0$ since $\\varepsilon_n \\to 0$',
            '$|4\\varepsilon_n + \\varepsilon_n^2| = 4$ always (constant)',
            '$|4\\varepsilon_n + \\varepsilon_n^2| \\geq 4$, so it does not go to zero',
            '$|4\\varepsilon_n + \\varepsilon_n^2| \\approx \\varepsilon_n$, which only goes to zero if $\\varepsilon_n$ is very small'
          ],
          correct: 0,
          explanations: [
            'Correct! By the triangle inequality, $|4\\varepsilon_n + \\varepsilon_n^2| \\leq 4|\\varepsilon_n| + |\\varepsilon_n|^2$ (since $|\\varepsilon_n^2| = \\varepsilon_n^2$ for all real $\\varepsilon_n$). Both $4|\\varepsilon_n|$ and $\\varepsilon_n^2 \\to 0$ as $\\varepsilon_n \\to 0$, so their sum $\\to 0$. By the squeeze theorem, $|a_n^2 - 4| \\to 0$.',
            'Wrong. The expression $4\\varepsilon_n + \\varepsilon_n^2$ depends on $n$ through $\\varepsilon_n$, so it is not constant.',
            'Wrong. When $\\varepsilon_n$ is small, $|4\\varepsilon_n + \\varepsilon_n^2|$ can be made arbitrarily small, not bounded below by $4$.',
            'Wrong. While it\'s true that $|4\\varepsilon_n + \\varepsilon_n^2|$ involves $\\varepsilon_n$, the leading term is $4\\varepsilon_n$, and $\\varepsilon_n \\to 0$ guarantees $|a_n^2 - 4| \\to 0$.'
          ]
        }
      ]
    },
    {
      id: 'sp3',
      difficulty: 3,
      statement: 'Use a change of index to simplify the sum $\\sum_{k=1}^n (k+1) \\cdot k$ and evaluate it.',
      steps: [
        {
          question: 'Expand the sum $\\sum_{k=1}^n (k+1) \\cdot k$ to see if you can recognize a pattern or re-index.',
          options: [
            '$\\sum_{k=1}^n (k^2 + k) = \\sum_{k=1}^n k^2 + \\sum_{k=1}^n k$',
            '$\\sum_{k=1}^n (k+1)! / k!$',
            '$\\sum_{k=1}^n 2k$ (the sum of the next $k$)',
            '$\\sum_{k=1}^n k^3$'
          ],
          correct: 0,
          explanations: [
            'Correct! Expanding $(k+1) \\cdot k = k^2 + k$, so $\\sum_{k=1}^n (k+1) \\cdot k = \\sum_{k=1}^n k^2 + \\sum_{k=1}^n k$. This separates into two well-known formulas.',
            'Wrong. $(k+1)! / k! = k+1$, not $(k+1) \\cdot k$. The original sum is a product, not factorials.',
            'Wrong. $(k+1) \\cdot k = k^2 + k$, which is much more than $2k$. Expanding gives the quadratic $k^2$.',
            'Wrong. Squaring $(k+1) \\cdot k$ does not yield $k^3$. The product $k(k+1) = k^2 + k$, not $k^3$.'
          ]
        },
        {
          question: 'What are the formulas for $\\sum_{k=1}^n k$ and $\\sum_{k=1}^n k^2$?',
          options: [
            '$\\sum_{k=1}^n k = n(n+1)/2$ and $\\sum_{k=1}^n k^2 = n(n+1)(2n+1)/6$',
            '$\\sum_{k=1}^n k = n^2$ and $\\sum_{k=1}^n k^2 = n^3$',
            '$\\sum_{k=1}^n k = 2n$ and $\\sum_{k=1}^n k^2 = n(n+1)$',
            '$\\sum_{k=1}^n k = (n+1)!/2$ and $\\sum_{k=1}^n k^2 = n^2(n+1)^2$'
          ],
          correct: 0,
          explanations: [
            'Correct! These are standard formulas: the sum of the first $n$ natural numbers is $n(n+1)/2$, and the sum of their squares is $n(n+1)(2n+1)/6$.',
            'Wrong. For example, $\\sum_{k=1}^n k = 1 + 2 + \\ldots + n \\neq n^2$ (for $n=1$, LHS$=1$, RHS$=1$ so OK, but for $n=2$, LHS$=3$, RHS$=4$). The correct formula is $n(n+1)/2$.',
            'Wrong. $\\sum_{k=1}^n k = 1 + 2 + 3 + \\ldots + n$, which is not $2n$. That would be $2$ times the average, not the sum.',
            'Wrong. Factorials grow much faster than polynomial sums. The formulas are simple polynomials in $n$, not factorials.'
          ]
        },
        {
          question: 'Compute $\\sum_{k=1}^n (k+1) \\cdot k = \\sum_{k=1}^n k^2 + \\sum_{k=1}^n k$.',
          options: [
            '$n(n+1)(2n+1)/6 + n(n+1)/2 = n(n+1)[(2n+1)/6 + 1/2] = n(n+1)(2n+4)/6 = n(n+1)(n+2)/3$',
            '$n(n+1)/2 + n(n+1) = n(n+1)(3/2) = 3n(n+1)/2$',
            '$n^2 + n = n(n+1)$',
            '$2n^2 + 3n$'
          ],
          correct: 0,
          explanations: [
            'Correct! Adding $n(n+1)(2n+1)/6 + n(n+1)/2$: factor out $n(n+1)$: $n(n+1)[(2n+1)/6 + 1/2] = n(n+1)[(2n+1)/6 + 3/6] = n(n+1)(2n+4)/6 = n(n+1) \\cdot 2(n+2)/6 = n(n+1)(n+2)/3$.',
            'Wrong. This incorrectly adds the two formulas. You must use the actual values: $n(n+1)(2n+1)/6$ and $n(n+1)/2$, not mix them up.',
            'Wrong. $n(n+1)$ is just the sum of the linear terms. The sum of the quadratic terms contributes $n(n+1)(2n+1)/6$, which is much larger.',
            'Wrong. While $2n^2 + 3n$ is a rough form of the answer, the correct factorization is $n(n+1)(n+2)/3$, which is a cleaner expression.'
          ]
        }
      ]
    }
  ]
};


const CH7 = {
  id: 'inequalities',
  num: 7,
  title: 'Inequality Arsenal',
  subtitle: 'AM-GM, Cauchy-Schwarz, and the power tools of estimation',
  defs: [
    {
      term: 'AM-GM Inequality',
      formal: 'For non-negative reals $a, b$, we have $(a+b)/2 \\geq \\sqrt{ab}$. Generally: the arithmetic mean is always $\\geq$ the geometric mean.',
      intuition: 'When you average two numbers, the result is at least as large as their "geometric average." This captures the idea that the sum of two numbers is large enough to bound their product.',
      example: 'For $a = 4$ and $b = 9$: $(4+9)/2 = 6.5$ and $\\sqrt{4 \\cdot 9} = 6$, so $6.5 \\geq 6$. This shows we can bound $36$ from below using the sum $13$.'
    },
    {
      term: 'Cauchy-Schwarz Inequality',
      formal: '$\\left(\\sum_{k=1}^{n} a_k b_k\\right)^2 \\leq \\left(\\sum_{k=1}^{n} a_k^2\\right)\\left(\\sum_{k=1}^{n} b_k^2\\right)$. The square of an inner product is bounded by the product of squared-sum norms.',
      intuition: 'This is the most powerful tool for controlling mixed sums. When you multiply sequences together and add them up, squaring that gives something controllable by the individual "energy" of each sequence.',
      example: 'For sequences $(1,2)$ and $(3,4)$: $(1 \\cdot 3 + 2 \\cdot 4)^2 = 11^2 = 121$, and $(1^2 + 2^2)(3^2 + 4^2) = 5 \\cdot 25 = 125$. Indeed $121 \\leq 125$.'
    },
    {
      term: 'Young\'s Inequality',
      formal: 'For $p, q > 1$ with $1/p + 1/q = 1$, and $a, b \\geq 0$: $ab \\leq a^p/p + b^q/q$. Generalizes AM-GM and decouples products.',
      intuition: 'When you have a product $ab$, you can split it into separate pieces $a^p$ and $b^q$, weighted by $1/p$ and $1/q$. This is useful when you want to control one factor tightly and let the other vary.',
      example: 'For $p = q = 2$ (conjugate exponents): $ab \\leq a^2/2 + b^2/2$. If $a = 3, b = 4$: $12 \\leq 9/2 + 16/2 = 12.5$. ✓'
    },
    {
      term: 'Bernoulli\'s Inequality',
      formal: 'For $n \\in \\mathbb{N}$ and $x \\geq -1$: $(1+x)^n \\geq 1 + nx$. The exponential-type expression is always at least linear in $x$.',
      intuition: 'When you raise $(1+x)$ to a power $n$, you get something that grows at least linearly with $x$. This is surprisingly tight and useful for bounding things like $(1 + 1/n)^n$.',
      example: 'For $x = 1/2$ and $n = 3$: $(1 + 1/2)^3 = (3/2)^3 = 27/8 = 3.375$, and $1 + 3 \\cdot (1/2) = 2.5$. Indeed $3.375 \\geq 2.5$.'
    }
  ],
  explained: [
    {
      id: 'iq1',
      difficulty: 1,
      statement: 'Use AM-GM to prove that $a^2 + b^2 \\geq 2ab$ for all $a, b \\geq 0$.',
      steps: [
        {
          title: 'Apply AM-GM directly',
          content: 'By AM-GM inequality, $(a^2 + b^2)/2 \\geq \\sqrt{a^2 \\cdot b^2} = ab$ (taking square root of both sides of the product).'
        },
        {
          title: 'Multiply both sides by 2',
          content: 'Multiplying both sides of $(a^2 + b^2)/2 \\geq ab$ by $2$ gives: $a^2 + b^2 \\geq 2ab$.'
        },
        {
          title: 'Conclude',
          content: 'We have shown $a^2 + b^2 \\geq 2ab$ for all $a, b \\geq 0$. Note: equality holds iff $a = b$. $\\blacksquare$'
        }
      ],
      answer: 'By AM-GM, $(a^2 + b^2)/2 \\geq \\sqrt{a^2b^2} = ab$. Multiplying by $2$: $a^2 + b^2 \\geq 2ab$.'
    },
    {
      id: 'iq2',
      difficulty: 2,
      statement: 'Use Bernoulli\'s inequality to show that $(1 + 1/n)^n \\geq 2$ for all $n \\geq 1$.',
      steps: [
        {
          title: 'Identify the setup for Bernoulli',
          content: 'We have $(1 + 1/n)^n$ where $x = 1/n \\geq 0$ and the exponent is $n \\in \\mathbb{N}$. Bernoulli\'s inequality applies: $(1 + 1/n)^n \\geq 1 + n \\cdot (1/n)$.'
        },
        {
          title: 'Simplify the right side',
          content: '$1 + n \\cdot (1/n) = 1 + 1 = 2$.'
        },
        {
          title: 'Combine the bounds',
          content: '$(1 + 1/n)^n \\geq 1 + n \\cdot (1/n) = 2$ for all $n \\geq 1$.'
        },
        {
          title: 'Verify for a specific value',
          content: 'For $n = 1$: $(1 + 1)^1 = 2 \\geq 2$. ✓ For $n = 2$: $(3/2)^2 = 2.25 \\geq 2$. ✓'
        }
      ],
      answer: 'By Bernoulli, $(1 + 1/n)^n \\geq 1 + n \\cdot (1/n) = 1 + 1 = 2$.'
    },
    {
      id: 'iq3',
      difficulty: 3,
      statement: 'Apply Cauchy-Schwarz to prove that $\\left(\\sum_{k=1}^{n} 1/k\\right) \\cdot \\left(\\sum_{k=1}^{n} k\\right) \\geq n^2$.',
      steps: [
        {
          title: 'Set up Cauchy-Schwarz',
          content: 'Let $a_k = 1/\\sqrt{k}$ and $b_k = \\sqrt{k}$ for $k = 1, 2, \\ldots, n$. Then by Cauchy-Schwarz: $\\left(\\sum_{k=1}^{n} a_k b_k\\right)^2 \\leq \\left(\\sum_{k=1}^{n} a_k^2\\right)\\left(\\sum_{k=1}^{n} b_k^2\\right)$.'
        },
        {
          title: 'Compute the inner product',
          content: '$\\sum_{k=1}^{n} a_k b_k = \\sum_{k=1}^{n} (1/\\sqrt{k}) \\cdot (\\sqrt{k}) = \\sum_{k=1}^{n} 1 = n$.'
        },
        {
          title: 'Compute the left and right norms',
          content: '$\\sum_{k=1}^{n} a_k^2 = \\sum_{k=1}^{n} (1/k)$ and $\\sum_{k=1}^{n} b_k^2 = \\sum_{k=1}^{n} k$.'
        },
        {
          title: 'Apply Cauchy-Schwarz and conclude',
          content: '$n^2 = \\left(\\sum_{k=1}^{n} 1\\right)^2 \\leq \\left(\\sum_{k=1}^{n} 1/k\\right)\\left(\\sum_{k=1}^{n} k\\right)$. Therefore $\\left(\\sum_{k=1}^{n} 1/k\\right)\\left(\\sum_{k=1}^{n} k\\right) \\geq n^2$. $\\blacksquare$'
        }
      ],
      answer: 'By Cauchy-Schwarz with $a_k = 1/\\sqrt{k}$ and $b_k = \\sqrt{k}$: $\\left(\\sum_{k=1}^{n} 1\\right)^2 \\leq \\left(\\sum_{k=1}^{n} 1/k\\right)\\left(\\sum_{k=1}^{n} k\\right)$, giving $n^2 \\leq \\left(\\sum_{k=1}^{n} 1/k\\right)\\left(\\sum_{k=1}^{n} k\\right)$.'
    },
    {
      id: 'iq4',
      difficulty: 4,
      statement: 'Use Young\'s inequality (with $p = q = 2$) to prove that $|ab| \\leq a^2/2 + b^2/2$, and apply it to bound a product in a convergence proof.',
      steps: [
        {
          title: 'State Young\'s inequality for $p = q = 2$',
          content: 'When $p = q = 2$, we have $1/p + 1/q = 1/2 + 1/2 = 1$. Young\'s inequality gives: $ab \\leq a^2/2 + b^2/2$ for $a, b \\geq 0$.'
        },
        {
          title: 'Extend to absolute values',
          content: 'For any real $a, b$: $|ab| = |a| \\cdot |b| \\leq |a|^2/2 + |b|^2/2 = a^2/2 + b^2/2$.'
        },
        {
          title: 'Apply to a convergence context',
          content: 'Suppose $x_n \\to 0$ and $y_n \\to 0$. Then $|x_n y_n| \\leq x_n^2/2 + y_n^2/2 \\to 0 + 0 = 0$, so $x_n y_n \\to 0$. This shows products of vanishing sequences vanish.'
        },
        {
          title: 'Conclude the general principle',
          content: 'Young\'s inequality decouples the product into separate terms, letting us control growth of each variable independently in more complex proofs.'
        }
      ],
      answer: 'Young\'s inequality with $p = q = 2$: $ab \\leq a^2/2 + b^2/2$. Thus $|x_n y_n| \\leq x_n^2/2 + y_n^2/2 \\to 0$ when $x_n, y_n \\to 0$.'
    },
    {
      id: 'iq5',
      difficulty: 5,
      statement: 'Prove the power mean inequality: $\\sqrt{(a^2 + b^2)/2} \\geq (a + b)/2$ for $a, b \\geq 0$, and use it to bound a sequence.',
      steps: [
        {
          title: 'Square both sides to avoid the square root',
          content: 'We want $\\sqrt{(a^2 + b^2)/2} \\geq (a + b)/2$. Squaring both sides (valid since both are non-negative): $(a^2 + b^2)/2 \\geq (a + b)^2/4$.'
        },
        {
          title: 'Expand and simplify',
          content: 'Multiply both sides by $4$: $2(a^2 + b^2) \\geq (a + b)^2 = a^2 + 2ab + b^2$. This gives $2a^2 + 2b^2 \\geq a^2 + 2ab + b^2$, or $a^2 + b^2 \\geq 2ab$.'
        },
        {
          title: 'Recognize this as AM-GM',
          content: 'We recover $a^2 + b^2 \\geq 2ab$, which we proved using AM-GM. So the power mean inequality holds, with equality iff $a = b$.'
        },
        {
          title: 'Apply to bound a sequence',
          content: 'If $a_n, b_n$ are bounded sequences with $a_n \\to L$ and $b_n \\to L$, then $\\sqrt{(a_n^2 + b_n^2)/2} \\leq \\max\\{|a_n|, |b_n|\\} \\cdot \\sqrt{2}$ is controlled by the individual bounds, and $\\sqrt{(L^2 + L^2)/2} = L\\sqrt{2}$ is the limit. This shows how the power mean helps in convergence arguments.'
        }
      ],
      answer: 'By squaring: $(a^2 + b^2)/2 \\geq (a+b)^2/4 \\Leftrightarrow a^2 + b^2 \\geq 2ab$ (AM-GM). For sequences, this bounds $\\sqrt{(a_n^2 + b_n^2)/2}$ by controlling each term separately.'
    }
  ],
  practice: [
    {
      id: 'iqp1',
      difficulty: 1,
      statement: 'For $a = 2$ and $b = 8$, use AM-GM to establish the bound $(a + b)/2 \\geq \\sqrt{ab}$. What is the relationship between the two sides?',
      steps: [
        {
          question: 'Calculate $(a + b)/2$ for $a = 2$ and $b = 8$.',
          options: ['5', '10', '6', '8'],
          correct: 0,
          explanations: [
            'Correct! $(2 + 8)/2 = 10/2 = 5$.',
            'You calculated $a + b = 10$, but forgot to divide by $2$.',
            'This is $\\sqrt{ab}$. We need $(a+b)/2$ first.',
            'This is one of the original values, not the average.'
          ]
        },
        {
          question: 'Calculate $\\sqrt{ab}$ for $a = 2$ and $b = 8$.',
          options: ['4', '5', '6.4', '10'],
          correct: 0,
          explanations: [
            'Correct! $\\sqrt{2 \\cdot 8} = \\sqrt{16} = 4$.',
            'This is $(a+b)/2$. We need $\\sqrt{ab}$.',
            'This is between $4$ and $5$ but not exact.',
            'This is $a + b$. We need $\\sqrt{ab}$.'
          ]
        },
        {
          question: 'Which of the following correctly states the AM-GM relationship for $a = 2, b = 8$?',
          options: ['$5 \\geq 4$', '$4 \\geq 5$', '$5 = 4$', 'Neither is $\\geq$ the other'],
          correct: 0,
          explanations: [
            'Correct! $5 \\geq 4$, so $(a+b)/2 \\geq \\sqrt{ab}$. AM-GM holds.',
            'This is backwards. The arithmetic mean should be larger.',
            'AM-GM is an inequality, not an equality (unless $a = b$).',
            'AM-GM states one must be $\\geq$ the other; here $(a+b)/2 \\geq \\sqrt{ab}$.'
          ]
        }
      ]
    },
    {
      id: 'iqp2',
      difficulty: 2,
      statement: 'Apply Bernoulli\'s inequality $(1 + x)^n \\geq 1 + nx$ to estimate $(1.1)^5$. Which statement is correct?',
      steps: [
        {
          question: 'In Bernoulli\'s inequality for $(1.1)^5$, what are $x$ and $n$?',
          options: ['$x = 0.1, n = 5$', '$x = 1.1, n = 5$', '$x = 5, n = 0.1$', '$x = 0.1, n = 1.1$'],
          correct: 0,
          explanations: [
            'Correct! $(1.1)^5 = (1 + 0.1)^5$, so $x = 0.1$ and $n = 5$.',
            '$x$ should be $0.1$ (the number added to $1$), not $1.1$.',
            'You reversed the roles. The exponent is $n = 5$.',
            'These are not set correctly. Bernoulli has $(1+x)^n$ form.'
          ]
        },
        {
          question: 'By Bernoulli, $(1.1)^5 \\geq 1 + 5(0.1) = ?$',
          options: ['1.5', '2.0', '1.6', '1.05'],
          correct: 0,
          explanations: [
            'Correct! $1 + 5(0.1) = 1 + 0.5 = 1.5$.',
            'Close, but $5(0.1) = 0.5$, not $1$. So $1 + 0.5 = 1.5$.',
            'You calculated $1 + 0.6$ instead of $1 + 0.5$.',
            'This is $1 + 0.05$, but the coefficient is $5$, not $0.5$.'
          ]
        },
        {
          question: 'Is the Bernoulli bound $(1.1)^5 \\geq 1.5$ tight (close to the true value)?',
          options: ['No, the true value ($\\approx 1.61$) is significantly larger', 'Yes, they are equal', 'No, the true value is smaller', 'Cannot be determined'],
          correct: 0,
          explanations: [
            'Correct! The actual value is $(1.1)^5 \\approx 1.61051$, which is $> 1.5$. Bernoulli gives a lower bound but not a tight one.',
            'Equality only holds when $x = 0$ (or when $n = 1$). They are not equal here.',
            'Bernoulli guarantees a lower bound, so the true value must be $\\geq 1.5$.',
            'We can determine this: Bernoulli gives a provable bound, and we know $(1.1)^5 \\approx 1.61$.'
          ]
        }
      ]
    },
    {
      id: 'iqp3',
      difficulty: 3,
      statement: 'Use Cauchy-Schwarz inequality to bound $\\sum_{k=1}^{3} 1 \\cdot k$. Set $a_k = 1$ and $b_k = k$.',
      steps: [
        {
          question: 'By Cauchy-Schwarz, $\\left(\\sum_{k=1}^{3} 1 \\cdot k\\right)^2 \\leq \\left(\\sum_{k=1}^{3} 1^2\\right)\\left(\\sum_{k=1}^{3} k^2\\right)$. Calculate $\\sum_{k=1}^{3} 1 \\cdot k$.',
          options: ['6', '14', '36', '9'],
          correct: 0,
          explanations: [
            'Correct! $\\sum_{k=1}^{3} 1 \\cdot k = 1 \\cdot 1 + 2 \\cdot 1 + 3 \\cdot 1 = 1 + 2 + 3 = 6$.',
            'This is $\\left(\\sum_{k=1}^{3} k^2\\right) = 1 + 4 + 9 = 14$, not $\\sum_{k=1}^{3} k$.',
            'This is $\\left(\\sum_{k=1}^{3} k\\right)^2 = 6^2 = 36$. But we need $\\sum_{k=1}^{3} 1 \\cdot k$ first.',
            'This is $\\sum_{k=1}^{3} 1^2 = 3$. We need the sum $1 + 2 + 3$.'
          ]
        },
        {
          question: 'Calculate $\\sum_{k=1}^{3} 1^2$ and $\\sum_{k=1}^{3} k^2$.',
          options: ['3 and 14', '3 and 9', '1 and 6', '3 and 36'],
          correct: 0,
          explanations: [
            'Correct! $\\sum_{k=1}^{3} 1^2 = 1 + 1 + 1 = 3$, and $\\sum_{k=1}^{3} k^2 = 1 + 4 + 9 = 14$.',
            'First sum is correct, but $\\sum_{k=1}^{3} k^2 = 1 + 4 + 9 = 14$, not $9$.',
            'These are not the squared sums. $\\sum_{k=1}^{3} 1^2 = 3$ and $\\sum_{k=1}^{3} k^2 = 14$.',
            'The first is right, but the second is $14$, not $36$ (which is $6^2$).'
          ]
        },
        {
          question: 'By Cauchy-Schwarz, $6^2 \\leq 3 \\cdot 14$. Verify: does $36 \\leq 42$ hold?',
          options: ['Yes, $36 \\leq 42$ is true', 'No, $36 > 42$', 'No, $36 = 42$', 'Cannot compare'],
          correct: 0,
          explanations: [
            'Correct! $36 \\leq 42$ is true, so Cauchy-Schwarz is satisfied.',
            'Actually $36 < 42$, so the inequality holds.',
            'They are not equal: $36 \\neq 42$. But the inequality $\\leq$ is satisfied.',
            'We can compare: both are numbers. $36$ is indeed $\\leq 42$.'
          ]
        }
      ]
    }
  ]
};

const CH8 = {
  id: 'assembly',
  num: 8,
  title: 'Assembly Patterns',
  subtitle: 'Combining tricks into complete proofs',
  defs: [
    {
      term: 'The $\\min\\{\\delta_1, \\delta_2\\}$ Pattern',
      formal: 'When a proof requires two independent conditions to hold simultaneously (e.g., $\\delta_1$ for one inequality and $\\delta_2$ for another), choose $\\delta = \\min\\{\\delta_1, \\delta_2, \\ldots, \\delta_k\\}$. This ensures all $k$ conditions are satisfied at once.',
      intuition: 'If you need $\\delta$ to be "small enough" in two different ways, take the smaller threshold. This guarantees that both conditions (which each have their own critical threshold) are both satisfied.',
      example: 'To prove $|f(x) - 2| < \\varepsilon$, you might need $|x - 1| < \\varepsilon/2$ and separately $|x - 1| < 1$. Take $\\delta = \\min\\{\\varepsilon/2, 1\\}$, so both are satisfied simultaneously.'
    },
    {
      term: 'Working Backwards from $\\varepsilon$',
      formal: 'Start with the desired conclusion $|f(x) - L| < \\varepsilon$, manipulate algebraically to extract what $\\delta$ must be, then write the proof forwards using that $\\delta$. The backwards phase is scratch work; the forwards phase is the polished proof.',
      intuition: 'Instead of guessing $\\delta$ out of thin air, derive it by asking "What constraint on $x$ gives $|f(x) - L| < \\varepsilon$?" This guides your choice and guarantees the proof will work.',
      example: 'Want $|3x + 1 - 4| < \\varepsilon$. Then $|3x - 3| < \\varepsilon$, so $|3(x - 1)| < \\varepsilon$, thus $|x - 1| < \\varepsilon/3$. Therefore $\\delta = \\varepsilon/3$ is the right choice.'
    },
    {
      term: 'The "Let $M = \\max\\{...\\}$" Pattern',
      formal: 'When bounding over finitely many items (e.g., $|f(x_1)|, |f(x_2)|, \\ldots, |f(x_n)|$), take $M = \\max\\{|f(x_1)|, \\ldots, |f(x_n)|\\}$. For behavior beyond the finite set, use convergence or continuity on that remaining region.',
      intuition: 'Finite sets are easy to control: just take the worst case. Infinite behavior is handled separately by convergence or uniform properties. This split simplifies the argument.',
      example: 'The first $100$ terms of a sequence might each be as large as $50$. So $|a_1|, \\ldots, |a_{100}| \\leq 100$. For $n > 100$, the sequence converges to $0$, so $|a_n| < \\varepsilon$ for $n \\geq N$. Finite part is bounded by max; tail is controlled by convergence.'
    },
    {
      term: 'Proof Architecture',
      formal: 'For $\\varepsilon$-$\\delta$ continuity: (1) Let $\\varepsilon > 0$ (given). (2) Define $\\delta$ in terms of $\\varepsilon$ (using backwards work). (3) Show that $|x - a| < \\delta \\Rightarrow |f(x) - f(a)| < \\varepsilon$. For sequence limits: (1) Let $\\varepsilon > 0$. (2) Use given convergences to find $N$ such that $n \\geq N$ ensures the bound. (3) For $n \\geq N$, chain the inequalities to reach the conclusion.',
      intuition: 'All proofs follow a rigid template: set up $\\varepsilon$, find the threshold ($\\delta$ or $N$), then verify the conclusion. Mastering the template lets you quickly assemble any $\\varepsilon$-$\\delta$ or convergence proof.',
      example: 'Template: "Let $\\varepsilon > 0$. Set $\\delta = \\varepsilon/3$. If $|x - 1| < \\delta$, then $|3x + 1 - 4| = |3(x-1)| = 3|x-1| < 3\\delta = \\varepsilon$. Thus $f$ is continuous at $1$." This is the forward-facing polished version.'
    }
  ],
  explained: [
    {
      id: 'asm1',
      difficulty: 1,
      statement: 'Complete an $\\varepsilon$-$\\delta$ proof that $f(x) = 3x + 1$ is continuous at $x = 1$. Show the backwards work first, then write the forwards proof.',
      steps: [
        {
          title: 'Backwards work: determine $\\delta$',
          content: 'We want $|f(x) - f(1)| < \\varepsilon$. Compute: $|3x + 1 - (3 \\cdot 1 + 1)| = |3x + 1 - 4| = |3(x - 1)| = 3|x - 1|$. For this to be $< \\varepsilon$, we need $3|x - 1| < \\varepsilon$, so $|x - 1| < \\varepsilon/3$. Thus $\\delta = \\varepsilon/3$.'
        },
        {
          title: 'Forward proof setup',
          content: 'Let $\\varepsilon > 0$. Set $\\delta = \\varepsilon/3$. We will show that $|x - 1| < \\delta$ implies $|f(x) - f(1)| < \\varepsilon$.'
        },
        {
          title: 'Chain the inequalities forward',
          content: 'Assume $|x - 1| < \\delta = \\varepsilon/3$. Then $|f(x) - f(1)| = |3x + 1 - 4| = |3(x - 1)| = 3|x - 1| < 3 \\cdot (\\varepsilon/3) = \\varepsilon$.'
        },
        {
          title: 'Conclusion',
          content: 'Thus $|f(x) - f(1)| < \\varepsilon$ whenever $|x - 1| < \\delta$. By definition, $f$ is continuous at $x = 1$. $\\blacksquare$'
        }
      ],
      answer: 'Backwards: $|3(x-1)| < \\varepsilon \\Rightarrow |x-1| < \\varepsilon/3$, so $\\delta = \\varepsilon/3$. Forwards: Let $\\varepsilon > 0$, set $\\delta = \\varepsilon/3$. If $|x-1| < \\delta$, then $|f(x)-f(1)| = 3|x-1| < 3 \\cdot (\\varepsilon/3) = \\varepsilon$.'
    },
    {
      id: 'asm2',
      difficulty: 2,
      statement: 'Prove that $f(x) = x^2$ is continuous at $x = a$ by combining the $\\delta$ choice with bounding $|x + a|$.',
      steps: [
        {
          title: 'Backwards work: factor and bound',
          content: 'We want $|x^2 - a^2| < \\varepsilon$. Factor: $|x^2 - a^2| = |x - a||x + a|$. For small $x$ near $a$, we can bound $|x + a| \\leq |x - a| + 2|a|$. To make this simple, assume $|x - a| < 1$, so $|x + a| \\leq 1 + 2|a| =: B$.'
        },
        {
          title: 'Derive $\\delta$ from $\\varepsilon$',
          content: 'We need $|x - a||x + a| < \\varepsilon$. Given $|x + a| \\leq B$, we need $|x - a| < \\varepsilon/B$. Set $\\delta = \\min\\{1, \\varepsilon/B\\}$ to ensure both $|x - a| < 1$ and $|x - a| < \\varepsilon/B$ hold.'
        },
        {
          title: 'Forward proof with $\\delta = \\min\\{1, \\varepsilon/B\\}$',
          content: 'Let $\\varepsilon > 0$. Let $B = 2|a| + 1$. Set $\\delta = \\min\\{1, \\varepsilon/B\\}$. If $|x - a| < \\delta$, then $|x - a| < 1$ and $|x - a| < \\varepsilon/B$. Also $|x + a| = |(x - a) + 2a| \\leq |x - a| + 2|a| < 1 + 2|a| = B$.'
        },
        {
          title: 'Conclude the bound',
          content: '$|f(x) - f(a)| = |x^2 - a^2| = |x - a||x + a| < (\\varepsilon/B) \\cdot B = \\varepsilon$. Thus $f$ is continuous at $a$. $\\blacksquare$'
        }
      ],
      answer: 'Let $B = 2|a| + 1$. Set $\\delta = \\min\\{1, \\varepsilon/B\\}$. If $|x-a| < \\delta$, then $|x-a| < 1$ so $|x+a| < B$, thus $|x^2-a^2| = |x-a||x+a| < (\\varepsilon/B) \\cdot B = \\varepsilon$.'
    },
    {
      id: 'asm3',
      difficulty: 3,
      statement: 'Prove that if $f_n \\to f$ uniformly and each $f_n$ is continuous at $x = a$, then $f$ is continuous at $x = a$. Use the $\\varepsilon/3$ trick to split the bound into three parts.',
      steps: [
        {
          title: 'Set up the three-part bound',
          content: 'We want to show $|f(x) - f(a)|$ is small. Write $|f(x) - f(a)| \\leq |f(x) - f_n(x)| + |f_n(x) - f_n(a)| + |f_n(a) - f(a)|$. We will make each piece $< \\varepsilon/3$.'
        },
        {
          title: 'Use uniform convergence for the outer pieces',
          content: 'Since $f_n \\to f$ uniformly, for $\\varepsilon/3$, there exists $N$ such that for all $n \\geq N$ and all $x \\in \\mathbb{R}$: $|f_n(x) - f(x)| < \\varepsilon/3$ and $|f_n(a) - f(a)| < \\varepsilon/3$. Fix such an $n \\geq N$.'
        },
        {
          title: 'Use continuity of $f_n$ for the middle piece',
          content: 'For this fixed $f_n$, since it is continuous at $a$, there exists $\\delta > 0$ such that $|x - a| < \\delta \\Rightarrow |f_n(x) - f_n(a)| < \\varepsilon/3$.'
        },
        {
          title: 'Combine all three bounds',
          content: 'If $|x - a| < \\delta$, then $|f(x) - f(a)| \\leq |f(x) - f_n(x)| + |f_n(x) - f_n(a)| + |f_n(a) - f(a)| < \\varepsilon/3 + \\varepsilon/3 + \\varepsilon/3 = \\varepsilon$. Thus $f$ is continuous at $a$. $\\blacksquare$'
        }
      ],
      answer: 'Use $f_n \\to f$ uniformly to make $|f(x)-f_n(x)|$ and $|f_n(a)-f(a)|$ each $< \\varepsilon/3$. Use continuity of $f_n$ to make $|f_n(x)-f_n(a)| < \\varepsilon/3$. Sum: $|f(x)-f(a)| < \\varepsilon$.'
    },
    {
      id: 'asm4',
      difficulty: 4,
      statement: 'Prove the algebra of limits: if $a_n \\to L$ and $b_n \\to M \\neq 0$, then $a_n/b_n \\to L/M$. Combine bounding $1/b_n$, add-subtract technique, $M$-bound, and $\\varepsilon$-budgeting.',
      steps: [
        {
          title: 'Step 1: Stabilize $b_n$ away from zero',
          content: 'Since $b_n \\to M \\neq 0$, for $\\varepsilon = |M|/2$, there exists $N_1$ such that $n \\geq N_1 \\Rightarrow |b_n - M| < |M|/2$. By triangle inequality, $|b_n| \\geq |M| - |b_n - M| > |M|/2$. Thus $1/|b_n| < 2/|M|$ for large $n$.'
        },
        {
          title: 'Step 2: Use the add-subtract technique',
          content: 'Write $a_n/b_n - L/M = (a_n M - L b_n M)/(b_n M) = (a_n M - L M + L M - L b_n M)/(b_n M) = [M(a_n-L) - L(b_n-M)]/(b_n M)$.'
        },
        {
          title: 'Step 3: Bound the numerator by $\\varepsilon$-budgeting',
          content: 'We want $|a_n/b_n - L/M|$ small. Given $\\varepsilon > 0$, use $a_n \\to L$ and $b_n \\to M$: choose $N_2$ such that $n \\geq N_2 \\Rightarrow |a_n - L| < \\varepsilon/(2(|M|+1))$ and $|b_n - M| < \\varepsilon|M|/(2(|L|+1))$. This ensures $|M(a_n-L)| < \\varepsilon/2$ and $|L(b_n-M)| < \\varepsilon/2$.'
        },
        {
          title: 'Step 4: Combine and conclude',
          content: 'For $n \\geq \\max\\{N_1, N_2\\}$: $|a_n/b_n - L/M| = |M(a_n-L) - L(b_n-M)|/(|b_n||M|) < (\\varepsilon/2 + \\varepsilon/2) \\cdot (2/|M|) \\cdot (1/|M|) < \\varepsilon \\cdot 2/(|M|^2)$. Adjust $\\varepsilon$-budgeting in earlier steps to ensure final bound $< \\varepsilon$. Thus $a_n/b_n \\to L/M$. $\\blacksquare$'
        }
      ],
      answer: 'Stabilize $b_n$: $|b_n| > |M|/2$ for large $n$, so $1/b_n$ is bounded. Use add-subtract: $a_n/b_n - L/M = [M(a_n-L) - L(b_n-M)]/(b_n M)$. Budget $\\varepsilon/2$ each to $a_n \\to L$ and $b_n \\to M$, ensuring the sum is $< \\varepsilon \\cdot (2/|M|^2)$, which approaches $0$.'
    },
    {
      id: 'asm5',
      difficulty: 5,
      statement: 'Prove that a continuous function on $[a,b]$ is uniformly continuous, using compactness (finite subcover) and showing how the $\\min\\{\\delta_1,\\ldots,\\delta_n\\}$ pattern combines all local $\\delta$\'s into a global one.',
      steps: [
        {
          title: 'Step 1: Use local continuity to find local $\\delta$\'s',
          content: 'Let $f$ be continuous on $[a,b]$ and $\\varepsilon > 0$. At each point $x \\in [a,b]$, continuity gives a $\\delta(x) > 0$ such that $|t - x| < \\delta(x) \\Rightarrow |f(t) - f(x)| < \\varepsilon/2$. The open balls $B_{\\delta(x)/2}(x)$ cover $[a,b]$.'
        },
        {
          title: 'Step 2: Apply compactness to extract a finite subcover',
          content: 'Since $[a,b]$ is compact, there exist finitely many points $x_1, \\ldots, x_n \\in [a,b]$ such that $[a,b] \\subseteq \\bigcup_{i=1}^{n} B_{\\delta(x_i)/2}(x_i)$. Let $\\delta = \\min\\{\\delta(x_1)/2, \\ldots, \\delta(x_n)/2\\} > 0$.'
        },
        {
          title: 'Step 3: Show uniform continuity via the min pattern',
          content: 'Let $s, t \\in [a,b]$ with $|s - t| < \\delta$. Then $s$ lies in some ball $B_{\\delta(x_i)/2}(x_i)$, so $|s - x_i| < \\delta(x_i)/2$. Since $|s - t| < \\delta \\leq \\delta(x_i)/2$, we have $|t - x_i| \\leq |t - s| + |s - x_i| < \\delta(x_i)/2 + \\delta(x_i)/2 = \\delta(x_i)$. Thus $|f(s) - f(x_i)| < \\varepsilon/2$ and $|f(t) - f(x_i)| < \\varepsilon/2$ by local continuity.'
        },
        {
          title: 'Step 4: Conclude uniform continuity',
          content: '$|f(s) - f(t)| \\leq |f(s) - f(x_i)| + |f(x_i) - f(t)| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$. We found a single $\\delta$ that works for all pairs $(s,t)$ with $|s-t| < \\delta$, proving uniform continuity. $\\blacksquare$'
        }
      ],
      answer: 'Continuity gives local $\\delta(x)$ at each $x$. Compactness yields a finite subcover with finitely many $\\delta(x_1),\\ldots,\\delta(x_n)$. Set $\\delta = \\min\\{\\delta(x_i)/2\\}$. If $|s-t| < \\delta$, both $s$ and $t$ satisfy $|\\cdot-x_i| < \\delta(x_i)$, so $|f(s)-f(t)| < \\varepsilon/2 + \\varepsilon/2 = \\varepsilon$.'
    }
  ],
  practice: [
    {
      id: 'asmp1',
      difficulty: 1,
      statement: 'For $f(x) = x^2$, prove continuity at $x = 2$ using $\\delta = \\min\\{1, \\varepsilon/5\\}$. What is the purpose of the min pattern here?',
      steps: [
        {
          question: 'Why do we use $\\delta = \\min\\{1, \\varepsilon/5\\}$ instead of just $\\delta = \\varepsilon/5$?',
          options: [
            'We need $|x-2| < 1$ to bound $|x+2| \\leq 5$, ensuring $|x^2-4| = |x-2||x+2| < \\varepsilon$',
            '$\\delta = \\varepsilon/5$ alone would make the proof incomplete',
            'The min pattern is always required in every proof',
            'We cannot use $\\varepsilon/5$ because it might be too large'
          ],
          correct: 0,
          explanations: [
            'Correct! The constraint $|x-2| < 1$ gives $|x+2| < 5$. Then $|x^2-4| = |x-2||x+2| < (\\varepsilon/5) \\cdot 5 = \\varepsilon$.',
            '$\\delta = \\varepsilon/5$ does work algebraically, but we need to first bound the other factor $|x+2|$, which requires controlling how close $x$ is to $2$.',
            'The min pattern is used when multiple constraints must hold simultaneously. Here we need both $|x-2| < 1$ (for bounding) and $|x-2| < \\varepsilon/5$ (for the $\\varepsilon$ condition).',
            'Both $\\varepsilon/5$ and $1$ are positive; we take the smaller to satisfy both constraints at once.'
          ]
        },
        {
          question: 'If $\\varepsilon = 0.1$, what is $\\delta = \\min\\{1, \\varepsilon/5\\}$?',
          options: ['$\\delta = 0.02$', '$\\delta = 1$', '$\\delta = 0.1$', '$\\delta = 0.05$'],
          correct: 0,
          explanations: [
            'Correct! $\\varepsilon/5 = 0.1/5 = 0.02$. Since $0.02 < 1$, $\\min\\{1, 0.02\\} = 0.02$.',
            '$\\varepsilon/5 = 0.02$, which is less than $1$, so we take the min (the smaller value).',
            'That is $\\varepsilon$ itself, not $\\varepsilon/5$.',
            'That is $\\varepsilon/2$, not $\\varepsilon/5$. $\\varepsilon/5 = 0.02$.'
          ]
        },
        {
          question: 'Using $\\delta = 0.02$, verify: if $|x-2| < 0.02$, is $|x^2-4| < 0.1$?',
          options: [
            'Yes, $|x-2||x+2| < 0.02 \\cdot 5 = 0.1$',
            'No, the bound is not tight enough',
            'Yes, but only by coincidence',
            'Cannot determine without knowing $x$'
          ],
          correct: 0,
          explanations: [
            'Correct! If $|x-2| < 0.02$ and we established $|x+2| \\leq 5$, then $|x^2-4| = |x-2||x+2| < 0.02 \\cdot 5 = 0.1 = \\varepsilon$.',
            'The bound is tight enough: $0.02 \\cdot 5 = 0.1$, which equals $\\varepsilon$.',
            'It is not a coincidence; the min pattern ensures both conditions work together exactly.',
            'We know $|x+2| \\leq 5$ from $|x-2| < 1$, and since $0.02 < 1$, this bound applies.'
          ]
        }
      ]
    },
    {
      id: 'asmp2',
      difficulty: 2,
      statement: 'In the proof that $f_n \\to f$ uniformly and each $f_n$ is continuous $\\Rightarrow$ $f$ is continuous, why do we use $\\varepsilon/3$ (not $\\varepsilon/2$)?',
      steps: [
        {
          question: 'How many pieces appear in $|f(x) - f(a)| \\leq |f(x) - f_n(x)| + |f_n(x) - f_n(a)| + |f_n(a) - f(a)|$?',
          options: ['3 pieces', '2 pieces', '4 pieces', '1 piece'],
          correct: 0,
          explanations: [
            'Correct! The three terms are: $|f(x)-f_n(x)|$, $|f_n(x)-f_n(a)|$, and $|f_n(a)-f(a)|$.',
            'This is the number of terms after "sandwich." The middle term $|f_n(x)-f_n(a)|$ is the third.',
            'We have exactly three pieces: the uniform convergence errors at $x$ and $a$, plus the continuity error at $a$.',
            'The full expression has three absolute-value terms, so three pieces.'
          ]
        },
        {
          question: 'If we set each piece $< \\varepsilon/3$, their sum is $< ?$',
          options: ['$\\varepsilon$', '$\\varepsilon/3$', '$3\\varepsilon$', '$\\varepsilon/2$'],
          correct: 0,
          explanations: [
            'Correct! $\\varepsilon/3 + \\varepsilon/3 + \\varepsilon/3 = 3 \\cdot (\\varepsilon/3) = \\varepsilon$.',
            'If each is $\\varepsilon/3$, the sum of three pieces is $3 \\cdot (\\varepsilon/3) = \\varepsilon$, not $\\varepsilon/3$.',
            'If the sum were $3\\varepsilon$, we would have set each piece to $\\varepsilon$, not $\\varepsilon/3$.',
            'If the sum were $\\varepsilon/2$, we would need each piece to be $\\varepsilon/6$ (since $3 \\cdot (\\varepsilon/6) = \\varepsilon/2$).'
          ]
        },
        {
          question: 'What if we had 4 pieces to bound? What fraction should each be?',
          options: ['$\\varepsilon/4$', '$\\varepsilon/3$', '$\\varepsilon/2$', '$\\varepsilon/5$'],
          correct: 0,
          explanations: [
            'Correct! With 4 pieces, each $< \\varepsilon/4$ ensures the sum $< 4 \\cdot (\\varepsilon/4) = \\varepsilon$.',
            '$\\varepsilon/3$ is for 3 pieces. With 4 pieces, we divide $\\varepsilon$ into 4 parts.',
            '$\\varepsilon/2$ is not the right split. We need $4 \\cdot (?) = \\varepsilon$, so $? = \\varepsilon/4$.',
            '$\\varepsilon/5$ is for 5 pieces, not 4. With $k$ pieces, set each $< \\varepsilon/k$.'
          ]
        }
      ]
    },
    {
      id: 'asmp3',
      difficulty: 3,
      statement: 'Complete an assembly proof: show that the sequence $a_n = (1 + 1/n)^n$ converges, using Bernoulli\'s inequality and the "Let $M = \\max\\{...\\}$" pattern for the first 10 terms.',
      steps: [
        {
          question: 'By Bernoulli, $(1 + 1/n)^n \\geq 1 + n \\cdot (1/n) = 2$ for all $n \\geq 1$. So $a_n$ is bounded below by $?$',
          options: ['2', '1', '$n$', '$1 + 1/n$'],
          correct: 0,
          explanations: [
            'Correct! Bernoulli gives $(1+1/n)^n \\geq 2$, so every term is $\\geq 2$.',
            'By Bernoulli, the bound is $1 + 1 = 2$, not just $1$.',
            '$n$ is not a lower bound; $a_n$ does not grow with $n$.',
            '$1 + 1/n$ approaches $1$ from above, much smaller than the actual terms.'
          ]
        },
        {
          question: 'For the finite terms $a_1, a_2, \\ldots, a_{10}$, let $M = \\max\\{a_1, \\ldots, a_{10}\\}$. Is $M \\geq a_n$ for $n > 10$?',
          options: [
            'No, we must show separately that $a_n$ is bounded for $n > 10$ by convergence',
            'Yes, $M$ bounds all $a_n$ for all $n$',
            'Only if $M$ is defined differently',
            'Cannot determine without computing $M$'
          ],
          correct: 0,
          explanations: [
            'Correct! $M$ controls the first 10 terms. For $n > 10$, we use a separate argument (e.g., $a_n$ is increasing and bounded above, so it converges).',
            '$M$ only bounds the finite set $\\{a_1,\\ldots,a_{10}\\}$. The tail $n > 10$ needs its own analysis.',
            'The definition of $M$ as the max of the finite set $\\{a_1,\\ldots,a_{10}\\}$ is standard. The tail requires a different bound.',
            'You can compute $M \\approx a_{10} \\approx 2.594$, but the point is that the finite set is separate from the tail.'
          ]
        },
        {
          question: 'To complete the proof that $a_n \\to L$ for some $L$, we would need to show the tail $n > 10$ is $?$',
          options: [
            'Increasing and bounded above (by some calculation, e.g., using the binomial expansion)',
            'Decreasing and bounded below',
            'Equal to $M$',
            'Divergent'
          ],
          correct: 0,
          explanations: [
            'Correct! The tail $\\{a_{11}, a_{12}, \\ldots\\}$ is increasing (by algebraic manipulation) and bounded above by $3$ (by the binomial theorem). Monotone bounded theorem applies.',
            'The sequence is actually increasing, not decreasing.',
            '$M$ bounds the first 10 terms, but the tail continues growing (towards $e$).',
            'The sequence is bounded and monotone, so it converges.'
          ]
        }
      ]
    }
  ]
};


const CHAPTERS = [CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8];


export default function AlgebraicTricks() {
  const [chapter, setChapter] = useState(0);
  const [section, setSection] = useState('defs');
  const [defIdx, setDefIdx] = useState(0);
  const [probIdx, setProbIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const containerRef = useRef(null);

  const ch = CHAPTERS[chapter];
  const items = ch[section];

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter, section, defIdx, probIdx, stepIdx]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    // Load KaTeX CSS
    const katexCss = document.createElement('link');
    katexCss.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    katexCss.rel = 'stylesheet';
    document.head.appendChild(katexCss);
    // Custom KaTeX color overrides for dark theme
    const style = document.createElement('style');
    style.textContent = `
      .katex { color: ${T.text}; font-size: 1.05em; }
      .katex .mord, .katex .mbin, .katex .mrel, .katex .mop, .katex .mopen, .katex .mclose, .katex .mpunct, .katex .minner { color: ${T.text}; }
    `;
    document.head.appendChild(style);
    document.body.style.margin = '0';
    document.body.style.background = T.bg;
  }, []);

  function goTo(sec, idx) {
    setSection(sec);
    if (sec === 'defs') setDefIdx(idx || 0);
    else { setProbIdx(idx || 0); setStepIdx(0); }
    setSelected(null);
    setShowExplanation(false);
  }

  function nextDef() {
    if (defIdx < ch.defs.length - 1) setDefIdx(defIdx + 1);
    else goTo('explained', 0);
  }

  function prevDef() {
    if (defIdx > 0) setDefIdx(defIdx - 1);
  }

  function nextProb() {
    const list = ch[section];
    if (probIdx < list.length - 1) {
      setProbIdx(probIdx + 1);
      setStepIdx(0);
      setSelected(null);
      setShowExplanation(false);
    } else if (section === 'explained') {
      goTo('practice', 0);
    } else {
      if (chapter < CHAPTERS.length - 1) {
        setChapter(chapter + 1);
        goTo('defs', 0);
      }
    }
  }

  function selectAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const prob = items[probIdx];
    const step = prob.steps[stepIdx];
    if (step.correct !== undefined) {
      setTotal(t => t + 1);
      if (idx === step.correct) setScore(s => s + 1);
    }
  }

  function nextStep() {
    const prob = items[probIdx];
    if (section === 'explained') {
      if (stepIdx < prob.steps.length - 1) setStepIdx(stepIdx + 1);
    } else {
      if (stepIdx < prob.steps.length - 1) {
        setStepIdx(stepIdx + 1);
        setSelected(null);
        setShowExplanation(false);
      }
    }
  }

  const wrap = { maxWidth: 720, margin: '0 auto', minHeight: '100vh', fontFamily: T.fontBody, color: T.text, padding: '0 16px', position: 'relative' };
  const headerS = { background: T.card, borderBottom: '1px solid ' + T.border, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0 0 12px 12px', marginBottom: 16 };
  const titleS = { fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.accent, margin: 0 };
  const subtitleS = { fontSize: 12, color: T.textDim, margin: 0 };
  const cardS = { background: T.card, border: '1px solid ' + T.border, borderRadius: 12, padding: 20, marginBottom: 16 };
  const defTermS = { fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.accent, marginBottom: 8 };
  const labelS = { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 };
  const mathS = { fontSize: 15, lineHeight: 1.8, background: T.cardAlt, padding: '12px 16px', borderRadius: 8, marginBottom: 12, overflowX: 'auto' };
  const bodyS = { fontSize: 15, lineHeight: 1.7, color: T.text, marginBottom: 12 };
  const btnS = { background: T.accent, color: T.bg, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody };
  const btnOutS = Object.assign({}, btnS, { background: 'transparent', border: '1px solid ' + T.accent, color: T.accent });
  const btnDimS = Object.assign({}, btnS, { background: T.cardAlt, color: T.textDim });
  const tabS = function(active) { return { padding: '8px 16px', border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody, background: active ? T.accentDim : 'transparent', color: active ? T.accent : T.textDim, transition: 'all .2s' }; };
  const progressBarS = { height: 3, background: T.cardAlt, borderRadius: 2, marginBottom: 16 };
  const progressFillS = function(pct) { return { height: '100%', background: T.accent, borderRadius: 2, width: pct + '%', transition: 'width .3s' }; };
  const optionS = function(sel, correct, show) {
    let bg = T.cardAlt, border = T.border, col = T.text;
    if (show && sel !== null) {
      if (correct) { bg = T.greenDim; border = T.green; col = T.green; }
      else { bg = T.redDim; border = T.red; col = T.red; }
    } else if (sel !== null) { bg = T.blueDim; border = T.blue; }
    return { background: bg, border: '1px solid ' + border, borderRadius: 10, padding: '12px 16px', marginBottom: 8, cursor: sel === null ? 'pointer' : 'default', color: col, fontSize: 14, lineHeight: 1.5, transition: 'all .2s' };
  };

  const totalItems = ch.defs.length + ch.explained.length + ch.practice.length;
  let currentItem = 0;
  if (section === 'defs') currentItem = defIdx;
  else if (section === 'explained') currentItem = ch.defs.length + probIdx;
  else currentItem = ch.defs.length + ch.explained.length + probIdx;
  const progress = ((currentItem + 1) / totalItems) * 100;

  return (
    <div ref={containerRef} style={wrap}>
      {showMenu && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100 }} onClick={() => setShowMenu(false)} />}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: T.card, zIndex: 101, padding: '20px 16px', overflowY: 'auto', transform: showMenu ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .3s' }}>
        <div style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.accent, marginBottom: 20 }}>Chapters</div>
        {CHAPTERS.map((c, i) => (
          <div key={c.id} onClick={() => { setChapter(i); goTo('defs', 0); setShowMenu(false); }}
            style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
              background: i === chapter ? T.accentDim : 'transparent',
              color: i === chapter ? T.accent : T.textDim, fontSize: 14, fontWeight: i === chapter ? 600 : 400 }}>
            {c.num}. {c.title}
          </div>
        ))}
        {total > 0 && (
          <div style={{ marginTop: 20, padding: '12px', background: T.cardAlt, borderRadius: 8, fontSize: 13, color: T.textDim }}>
            Score: {score}/{total} ({Math.round(score/total*100)}%)
          </div>
        )}
      </div>

      <div style={headerS}>
        <div>
          <button onClick={() => setShowMenu(true)} style={{ background: 'none', border: 'none', color: T.textDim, fontSize: 18, cursor: 'pointer', marginRight: 8 }}>&#9776;</button>
          <span style={{ fontFamily: T.font, fontSize: 14, color: T.accent, fontWeight: 600 }}>Ch {ch.num}</span>
        </div>
        <div>
          <p style={titleS}>{ch.title}</p>
          <p style={subtitleS}>{ch.subtitle}</p>
        </div>
        <div style={{ fontSize: 12, color: T.textDim }}>{score}/{total}</div>
      </div>

      <div style={progressBarS}><div style={progressFillS(progress)} /></div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button style={tabS(section==='defs')} onClick={() => goTo('defs',0)}>Definitions</button>
        <button style={tabS(section==='explained')} onClick={() => goTo('explained',0)}>Explained</button>
        <button style={tabS(section==='practice')} onClick={() => goTo('practice',0)}>Practice</button>
      </div>

      {section === 'defs' && ch.defs[defIdx] && (() => {
        const d = ch.defs[defIdx];
        return (
          <div style={cardS}>
            <div style={Object.assign({}, labelS, { color: T.blue })}>DEFINITION {defIdx + 1} OF {ch.defs.length}</div>
            <div style={defTermS}><Tex>{d.term}</Tex></div>
            <div style={Object.assign({}, labelS, { color: T.textMuted, marginTop: 16 })}>FORMAL</div>
            <TexBlock style={mathS}>{d.formal}</TexBlock>
            <div style={Object.assign({}, labelS, { color: T.textMuted })}>INTUITION</div>
            <TexBlock style={bodyS}>{d.intuition}</TexBlock>
            <div style={Object.assign({}, labelS, { color: T.textMuted })}>EXAMPLE</div>
            <TexBlock style={mathS}>{d.example}</TexBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button style={defIdx > 0 ? btnOutS : btnDimS} onClick={prevDef} disabled={defIdx === 0}>{'← Prev'}</button>
              <button style={btnS} onClick={nextDef}>{defIdx < ch.defs.length - 1 ? 'Next →' : 'Start Problems →'}</button>
            </div>
          </div>
        );
      })()}

      {section === 'explained' && items[probIdx] && (() => {
        const prob = items[probIdx];
        return (
          <div style={cardS}>
            <div style={Object.assign({}, labelS, { color: T.green })}>EXPLAINED {probIdx + 1} OF {items.length} {' · Difficulty ' + '★'.repeat(prob.difficulty) + '☆'.repeat(5 - prob.difficulty)}</div>
            <TexBlock style={{ fontFamily: T.font, fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16, lineHeight: 1.5 }}>{prob.statement}</TexBlock>
            {prob.steps.map((step, i) => (
              <div key={i} style={{ opacity: i <= stepIdx ? 1 : 0.3, marginBottom: 12, transition: 'opacity .3s' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.accent, marginBottom: 4 }}>Step {i + 1}: <Tex>{step.title}</Tex></div>
                {i <= stepIdx && <TexBlock style={mathS}>{step.content}</TexBlock>}
              </div>
            ))}
            {stepIdx < prob.steps.length - 1 && (
              <button style={btnS} onClick={nextStep}>Reveal Next Step →</button>
            )}
            {stepIdx === prob.steps.length - 1 && (
              <div>
                <div style={Object.assign({}, cardS, { background: T.accentDim, border: '1px solid ' + T.accent, marginTop: 12 })}>
                  <div style={Object.assign({}, labelS, { color: T.accent })}>ANSWER</div>
                  <TexBlock style={{ fontFamily: T.fontMono, fontSize: 14, color: T.accent }}>{prob.answer}</TexBlock>
                </div>
                <button style={Object.assign({}, btnS, { marginTop: 8 })} onClick={nextProb}>
                  {probIdx < items.length - 1 ? 'Next Problem →' : 'Start Practice →'}
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {section === 'practice' && items[probIdx] && (() => {
        const prob = items[probIdx];
        const step = prob.steps[stepIdx];
        if (!step) return null;
        return (
          <div style={cardS}>
            <div style={Object.assign({}, labelS, { color: T.blue })}>PRACTICE {probIdx + 1} OF {items.length} · STEP {stepIdx + 1} OF {prob.steps.length}</div>
            <TexBlock style={{ fontFamily: T.font, fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 8, lineHeight: 1.5 }}>{prob.statement}</TexBlock>
            <TexBlock style={{ fontSize: 15, color: T.text, marginBottom: 16, lineHeight: 1.5 }}>{step.question}</TexBlock>
            {step.options.map((opt, i) => (
              <div key={i} style={optionS(selected === i, i === step.correct, showExplanation)}
                onClick={() => selectAnswer(i)}>
                <span style={{ fontWeight: 600, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>
                <Tex>{opt}</Tex>
                {showExplanation && selected === i && (
                  <TexBlock style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>{step.explanations[i]}</TexBlock>
                )}
              </div>
            ))}
            {showExplanation && selected !== step.correct && (
              <div style={Object.assign({}, mathS, { background: T.greenDim, border: '1px solid ' + T.green, marginTop: 8 })}>
                <span style={{ fontWeight: 600, color: T.green }}>Correct answer: {String.fromCharCode(65 + step.correct)}.</span> <Tex>{step.explanations[step.correct]}</Tex>
              </div>
            )}
            {showExplanation && (
              <button style={Object.assign({}, btnS, { marginTop: 12 })} onClick={() => {
                if (stepIdx < prob.steps.length - 1) { nextStep(); }
                else nextProb();
              }}>
                {stepIdx < prob.steps.length - 1 ? 'Next Question →' : probIdx < items.length - 1 ? 'Next Problem →' : chapter < CHAPTERS.length - 1 ? 'Next Chapter →' : 'Course Complete!'}
              </button>
            )}
          </div>
        );
      })()}

      <div style={{ textAlign: 'center', padding: '20px 0 40px', fontSize: 12, color: T.textMuted }}>
        Algebraic Tricks for Real Analysis · Chapter {ch.num} of {CHAPTERS.length}
      </div>
    </div>
  );
}
