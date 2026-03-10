import React, { useState, useEffect, useRef } from 'react';

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

const CH1 = {
  id:'add-zero', num:1, title:'Adding Zero Creatively', subtitle:'The most powerful move: insert a term and its negative',
  defs:[
    { term:'Add-and-Subtract', formal:'To analyze a\u2212c, insert a bridge term b: a\u2212c = (a\u2212b) + (b\u2212c). Each piece is chosen to be easier to bound or simplify than the original.',
      intuition:'Imagine walking from city A to city C. The direct path is unclear, but if you stop at city B, each leg is straightforward. That intermediate stop is the term you add and subtract.',
      example:'To show |a\u2099\u2212L| is small: |a\u2099\u2212L| = |(a\u2099\u2212b\u2099) + (b\u2099\u2212L)| \u2264 |a\u2099\u2212b\u2099| + |b\u2099\u2212L|. Now bound each piece separately.'
    },
    { term:'The \u03b5/2 Budget', formal:'When proving a\u2099 \u2192 L, given \u03b5 > 0, allocate \u03b5/2 to each of two pieces. If |a\u2099\u2212b\u2099| < \u03b5/2 and |b\u2099\u2212L| < \u03b5/2, then |a\u2099\u2212L| < \u03b5.',
      intuition:'You have an error budget of \u03b5. Split it equally between two sources of error. Each piece gets half the budget, and the total stays within bounds. For k pieces, use \u03b5/k.',
      example:'Proving lim(a\u2099+b\u2099) = A+B: |(a\u2099+b\u2099)\u2212(A+B)| = |(a\u2099\u2212A)+(b\u2099\u2212B)| \u2264 |a\u2099\u2212A| + |b\u2099\u2212B| < \u03b5/2 + \u03b5/2 = \u03b5.'
    },
    { term:'Telescoping Insertion', formal:'Write a\u2099\u2212a\u2081 = \u03a3(a\u2096\u208a\u2081\u2212a\u2096) for k=1..n\u22121. This converts a global difference into a sum of local steps.',
      intuition:'To measure the total distance from start to finish, sum up the distance of each individual step. This is how you turn a single complicated expression into many simple ones.',
      example:'\u03a3 1/(k(k+1)) = \u03a3 (1/k \u2212 1/(k+1)) = 1 \u2212 1/(n+1). The intermediate terms all cancel.'
    },
    { term:'Anchoring to a Known Quantity', formal:'When estimating f(x), write f(x) = f(x\u2080) + (f(x)\u2212f(x\u2080)) where x\u2080 is a convenient reference point. The first term is known; bound the second.',
      intuition:'If you know the temperature at noon, estimate 2pm by saying "noon\u2019s temp plus the change." You anchor to something you know, then control the deviation.',
      example:'Estimating \u221a(4.01): \u221a(4.01) = \u221a4 + (\u221a(4.01)\u2212\u221a4) = 2 + (small correction). The correction is approximately 0.01/(2\u221a4) = 0.0025.'
    }
  ],
  explained:[
    { id:'az1', difficulty:1, statement:'Prove that if a\u2099 \u2192 L and b\u2099 \u2192 M, then a\u2099 + b\u2099 \u2192 L + M.',
      steps:[
        {title:'Identify the trick needed', content:'We need |(a\u2099+b\u2099) \u2212 (L+M)| < \u03b5. This is a single expression involving TWO sequences. The trick: regroup to isolate each sequence.'},
        {title:'Add zero: insert \u2212L + L', content:'|(a\u2099+b\u2099) \u2212 (L+M)| = |(a\u2099\u2212L) + (b\u2099\u2212M)|. No term was added or removed \u2014 we just regrouped. Now apply the triangle inequality.'},
        {title:'Apply triangle inequality and budget \u03b5', content:'\u2264 |a\u2099\u2212L| + |b\u2099\u2212M|. Allocate \u03b5/2 to each. Since a\u2099 \u2192 L, \u2203N\u2081 with |a\u2099\u2212L| < \u03b5/2 for n \u2265 N\u2081. Since b\u2099 \u2192 M, \u2203N\u2082 with |b\u2099\u2212M| < \u03b5/2 for n \u2265 N\u2082.'},
        {title:'Combine', content:'Let N = max{N\u2081, N\u2082}. For n \u2265 N: |(a\u2099+b\u2099)\u2212(L+M)| < \u03b5/2 + \u03b5/2 = \u03b5. \u220e The key trick was regrouping (adding zero) and then splitting the \u03b5 budget.'}
      ], answer:'a\u2099+b\u2099 \u2192 L+M by the add-and-subtract regrouping + \u03b5/2 trick'
    },
    { id:'az2', difficulty:2, statement:'Prove: if a\u2099 \u2192 L, then |a\u2099| \u2192 |L|.',
      steps:[
        {title:'Start from the goal', content:'We need ||a\u2099| \u2212 |L|| < \u03b5. The expression ||a\u2099| \u2212 |L|| looks hard to work with directly.'},
        {title:'Use reverse triangle inequality', content:'The reverse triangle inequality says ||a| \u2212 |b|| \u2264 |a \u2212 b|. So ||a\u2099| \u2212 |L|| \u2264 |a\u2099 \u2212 L|.'},
        {title:'Use convergence of a\u2099', content:'Since a\u2099 \u2192 L, given \u03b5 > 0, \u2203N with |a\u2099 \u2212 L| < \u03b5 for n \u2265 N. Therefore ||a\u2099| \u2212 |L|| \u2264 |a\u2099 \u2212 L| < \u03b5. \u220e'},
        {title:'Why this matters', content:'The trick here was recognizing that the reverse triangle inequality lets you bound a complicated expression by a simpler one. You didn\u2019t add zero explicitly, but you used an inequality that essentially "adds zero" inside the absolute value.'}
      ], answer:'||a\u2099|\u2212|L|| \u2264 |a\u2099\u2212L| < \u03b5'
    },
    { id:'az3', difficulty:3, statement:'Prove that a\u2099b\u2099 \u2192 LM when a\u2099 \u2192 L and b\u2099 \u2192 M.',
      steps:[
        {title:'The key trick: add and subtract Lb\u2099', content:'|a\u2099b\u2099 \u2212 LM| = |a\u2099b\u2099 \u2212 Lb\u2099 + Lb\u2099 \u2212 LM| = |(a\u2099\u2212L)b\u2099 + L(b\u2099\u2212M)|. We inserted \u2212Lb\u2099 + Lb\u2099 = 0 to create two terms we can handle.'},
        {title:'Apply triangle inequality', content:'\u2264 |a\u2099\u2212L||b\u2099| + |L||b\u2099\u2212M|. Now we need to bound each piece. The second term is easy: |L||b\u2099\u2212M| < |L|\u00b7\u03b5/(2|L|+1). But the first term has |b\u2099| which varies!'},
        {title:'Bound the varying factor', content:'Since b\u2099 \u2192 M, the sequence (b\u2099) is bounded: \u2203B > 0 with |b\u2099| \u2264 B for all n. Now |a\u2099\u2212L||b\u2099| \u2264 B|a\u2099\u2212L| < B\u00b7\u03b5/(2B) = \u03b5/2.'},
        {title:'Assemble the budget', content:'Choose N large enough that |a\u2099\u2212L| < \u03b5/(2B) and |b\u2099\u2212M| < \u03b5/(2(|L|+1)). Then |a\u2099b\u2099\u2212LM| < \u03b5/2 + \u03b5/2 = \u03b5. \u220e Three tricks in one proof: add-and-subtract, bounding a variable factor, and \u03b5-budgeting.'}
      ], answer:'a\u2099b\u2099 \u2192 LM via add-subtract Lb\u2099, bounding b\u2099, and \u03b5/2 split'
    },
    { id:'az4', difficulty:4, statement:'Prove: \u03a3 1/(k(k+1)) from k=1 to n equals 1 \u2212 1/(n+1) using telescoping.',
      steps:[
        {title:'Decompose via partial fractions', content:'1/(k(k+1)) = A/k + B/(k+1). Multiply through: 1 = A(k+1) + Bk. Set k=0: A=1. Set k=\u22121: B=\u22121. So 1/(k(k+1)) = 1/k \u2212 1/(k+1).'},
        {title:'Write out the sum', content:'\u03a3 (1/k \u2212 1/(k+1)) = (1\u22121/2) + (1/2\u22121/3) + (1/3\u22121/4) + \u2026 + (1/n\u22121/(n+1)).'},
        {title:'Watch the cancellation', content:'Each \u22121/(k+1) from one term cancels the +1/(k+1) from the next. This is why it is called "telescoping" \u2014 the sum collapses like a telescope.'},
        {title:'What remains', content:'Only the first term of the first summand and the last term of the last summand survive: 1 \u2212 1/(n+1). \u220e The trick was adding zero repeatedly \u2014 each \u22121/(k+1) + 1/(k+1) = 0 cancellation is an instance of the pattern.'}
      ], answer:'\u03a3 1/(k(k+1)) = 1 \u2212 1/(n+1) by partial fractions then telescoping'
    },
    { id:'az5', difficulty:5, statement:'Prove: if a\u2099 is Cauchy and a subsequence a\u2099\u2096 \u2192 L, then a\u2099 \u2192 L.',
      steps:[
        {title:'The bridge term', content:'We need |a\u2099 \u2212 L| < \u03b5. The trick: insert the bridge \u2212a\u2099\u2096 + a\u2099\u2096 = 0. So |a\u2099 \u2212 L| = |(a\u2099 \u2212 a\u2099\u2096) + (a\u2099\u2096 \u2212 L)| \u2264 |a\u2099 \u2212 a\u2099\u2096| + |a\u2099\u2096 \u2212 L|.'},
        {title:'Budget \u03b5/2 to each piece', content:'Cauchy gives N\u2081 with |a\u2099 \u2212 a\u2098| < \u03b5/2 for m,n \u2265 N\u2081. Subsequence convergence gives K with |a\u2099\u2096 \u2212 L| < \u03b5/2 for k \u2265 K.'},
        {title:'Choose the bridge carefully', content:'Pick k \u2265 K large enough that n\u2096 \u2265 N\u2081 as well. Then for n \u2265 N\u2081: |a\u2099 \u2212 a\u2099\u2096| < \u03b5/2 (both indices \u2265 N\u2081) and |a\u2099\u2096 \u2212 L| < \u03b5/2 (k \u2265 K).'},
        {title:'Conclude', content:'|a\u2099 \u2212 L| < \u03b5/2 + \u03b5/2 = \u03b5 for all n \u2265 N\u2081. \u220e The entire proof is one application of add-and-subtract with the subsequence term as bridge.'}
      ], answer:'a\u2099 \u2192 L via bridge term a\u2099\u2096 with \u03b5/2 budget'
    }
  ],
  practice:[
    { id:'azp1', difficulty:1, statement:'To prove |(a\u2099+b\u2099) \u2212 (A+B)| < \u03b5, what is the first move?',
      steps:[
        { question:'How do you rewrite (a\u2099+b\u2099) \u2212 (A+B)?', options:['(a\u2099\u2212A) + (b\u2099\u2212B)','a\u2099b\u2099 \u2212 AB','(a\u2099+b\u2099)(A+B)','a\u2099\u2212b\u2099+A\u2212B'],correct:0,
          explanations:['Correct! Regroup to isolate each sequence\'s deviation from its limit. This is the add-and-subtract pattern.','That would be relevant for proving a product limit, not a sum.','Multiplying doesn\'t help here \u2014 we need to isolate each sequence.','Check your signs: (a\u2099+b\u2099)\u2212(A+B) = a\u2099\u2212A+b\u2099\u2212B, not a\u2099\u2212b\u2099+A\u2212B.']},
        { question:'After applying the triangle inequality, how should you split the \u03b5 budget?', options:['\u03b5/2 to each term','All \u03b5 to the first term','\u03b5/3 to each term','\u221a\u03b5 to each term'],correct:0,
          explanations:['Correct! Two terms, each gets \u03b5/2. Then \u03b5/2 + \u03b5/2 = \u03b5.','Then you have no budget left for the second term.','That would give total 2\u03b5/3 < \u03b5, which works but wastes budget. Standard practice is \u03b5/2.','That doesn\'t sum to \u03b5: \u221a\u03b5 + \u221a\u03b5 = 2\u221a\u03b5 \u2260 \u03b5.']},
        { question:'Why do we take N = max{N\u2081, N\u2082}?', options:['So both bounds hold simultaneously for n \u2265 N','It gives a tighter bound','It\'s required by the Archimedean property','To make N as large as possible'],correct:0,
          explanations:['Correct! For n \u2265 max{N\u2081,N\u2082}, both n \u2265 N\u2081 and n \u2265 N\u2082, so both \u03b5/2 bounds hold at once.','max actually gives a looser N, but it ensures both conditions hold.','The Archimedean property helps find each N\u1d62, but max combines them.','We don\'t want N large for its own sake \u2014 we need both conditions to hold.']}
      ]
    },
    { id:'azp2', difficulty:3, statement:'In the product limit proof (a\u2099b\u2099 \u2192 LM), what term do you add and subtract?',
      steps:[
        { question:'To split a\u2099b\u2099 \u2212 LM into manageable pieces, insert:', options:['Lb\u2099 (giving (a\u2099\u2212L)b\u2099 + L(b\u2099\u2212M))','a\u2099M (giving a\u2099(b\u2099\u2212M) + (a\u2099\u2212L)M)','(a\u2099+L)(b\u2099+M)/2','LM/2'],correct:0,
          explanations:['Correct! This is the standard choice. You could also use a\u2099M (option B) \u2014 both work. The key insight is inserting a "mixed" term.','This also works! a\u2099b\u2099 \u2212 a\u2099M + a\u2099M \u2212 LM = a\u2099(b\u2099\u2212M) + M(a\u2099\u2212L). But the standard approach uses Lb\u2099.','This doesn\'t factor into useful pieces.','This doesn\'t relate to the structure of the expression.']},
        { question:'Why is bounding |b\u2099| necessary in the (a\u2099\u2212L)b\u2099 term?', options:['Because b\u2099 varies with n, so we need a fixed bound B','Because b\u2099 could be zero','Because |b\u2099| \u2265 |M|','To apply the Archimedean property'],correct:0,
          explanations:['Correct! We need |a\u2099\u2212L|\u00b7|b\u2099| < \u03b5/2, which means |a\u2099\u2212L| < \u03b5/(2|b\u2099|). Since |b\u2099| varies, we bound it by a constant B, then require |a\u2099\u2212L| < \u03b5/(2B).','b\u2099 \u2192 M so for large n, b\u2099 \u2260 0 (if M \u2260 0). But the real reason is we need a fixed number in the bound.','Not necessarily true, and not the reason.','The Archimedean property might help find N, but the bound is needed to set up the \u03b5-budget.']},
        { question:'What convergence property guarantees b\u2099 is bounded?', options:['Every convergent sequence is bounded','Every monotone sequence is bounded','The Bolzano\u2013Weierstrass theorem','The completeness axiom'],correct:0,
          explanations:['Correct! If b\u2099 \u2192 M, then (b\u2099) is convergent, hence bounded. This is a foundational fact used constantly.','Monotone sequences need not be bounded (e.g. n is monotone increasing and unbounded).','BW says bounded sequences have convergent subsequences \u2014 the reverse direction.','Completeness guarantees sups exist, not directly that sequences are bounded.']}
      ]
    },
    { id:'azp3', difficulty:5, statement:'Recognize the add-and-subtract trick: prove |a\u2099\u00b2 \u2212 L\u00b2| \u2192 0 given a\u2099 \u2192 L.',
      steps:[
        { question:'What factoring helps with a\u2099\u00b2 \u2212 L\u00b2?', options:['(a\u2099\u2212L)(a\u2099+L) \u2014 difference of squares','(a\u2099\u2212L)\u00b2 + 2L(a\u2099\u2212L)','a\u2099(a\u2099\u2212L) + L(a\u2099\u2212L)','All three are valid'],correct:3,
          explanations:['This is the classic approach: |a\u2099\u00b2\u2212L\u00b2| = |a\u2099\u2212L||a\u2099+L|. But see option D.','This also works: a\u2099\u00b2\u2212L\u00b2 = (a\u2099\u2212L)\u00b2 + 2L(a\u2099\u2212L). Both terms have factor (a\u2099\u2212L). But see option D.','Also valid: a\u2099\u00b2\u2212L\u00b2 = a\u2099(a\u2099\u2212L) + L(a\u2099\u2212L) = (a\u2099+L)(a\u2099\u2212L). But see option D.','Correct! All three factorings work. The add-and-subtract insight is that you can decompose a\u2099\u00b2\u2212L\u00b2 multiple ways, and all lead to a proof.']},
        { question:'Using |a\u2099\u00b2\u2212L\u00b2| = |a\u2099\u2212L||a\u2099+L|, what do you need to bound?', options:['|a\u2099+L|, since a\u2099 varies','|a\u2099\u2212L|, since we don\'t know the limit','Both \u2014 neither is fixed','Only |a\u2099\u2212L| since |a\u2099+L| is always small'],correct:0,
          explanations:['Correct! Since a\u2099 \u2192 L, the sequence is bounded: |a\u2099| \u2264 B, so |a\u2099+L| \u2264 B+|L|. This gives a fixed bound.','We do know a\u2099 \u2192 L, so |a\u2099\u2212L| < \u03b5/(B+|L|) for large n.','|a\u2099\u2212L| is controlled by convergence; |a\u2099+L| is controlled by boundedness. Both are handled but differently.','|a\u2099+L| is approximately 2L, not small. You need to BOUND it, not assume it\'s small.']},
        { question:'This is the same trick as the product limit proof. What pattern do both share?', options:['Factor into (something \u2192 0) \u00d7 (something bounded)','Factor into (something small) + (something small)','Use the squeeze theorem','Use monotone convergence'],correct:0,
          explanations:['Correct! Both proofs factor the expression as (vanishing term) \u00d7 (bounded term). The vanishing factor goes to 0, the bounded factor stays controlled, so the product goes to 0. This is one of the most important patterns in analysis.','That\'s the add-and-subtract pattern. This is the multiply pattern: small \u00d7 bounded \u2192 0.','The squeeze theorem is a different technique.','Monotone convergence requires monotonicity.']}
      ]
    }
  ]
};

const CH2 = {
  id:'multiply-one', num:2, title:'Multiplying by One', subtitle:'Conjugates, strategic factors, and the art of creative multiplication',
  defs:[
    { term:'Conjugate Multiplication', formal:'To simplify \u221aa \u2212 \u221ab, multiply and divide by the conjugate: (\u221aa\u2212\u221ab)(\u221aa+\u221ab)/(\u221aa+\u221ab) = (a\u2212b)/(\u221aa+\u221ab).',
      intuition:'Square roots are hard to bound. But the difference of square roots, when multiplied by the sum, becomes a simple difference of the radicands. You trade an ugly expression for a fraction with a nice numerator.',
      example:'\u221a(n+1) \u2212 \u221an = ((n+1)\u2212n)/(\u221a(n+1)+\u221an) = 1/(\u221a(n+1)+\u221an) \u2264 1/(2\u221an).'
    },
    { term:'Multiply by n/n or f/f', formal:'Insert the factor g(x)/g(x) = 1 to create a useful product or quotient structure. Common choices: n/n, (1+x)/(1+x), e\u207b\u02e3e\u02e3.',
      intuition:'Multiplying by 1 doesn\u2019t change the value, but it can change the form dramatically. It\u2019s like rotating a puzzle piece \u2014 same piece, but now it fits.',
      example:'To bound n\u00b7r\u207f for |r|<1: write n\u00b7r\u207f = n\u00b7r\u207f\u00b9\u00b2\u00b7r\u207f\u00b9\u00b2 (splitting r\u207f). The first factor \u2192 0 by one argument, the second \u2192 0 independently.'
    },
    { term:'Rationalizing the Numerator/Denominator', formal:'When a limit involves \u221af(x) \u2212 \u221ag(x) in a fraction, multiply top and bottom by \u221af(x) + \u221ag(x) to eliminate the square roots from one position.',
      intuition:'The numerator has a square root difference that you can\u2019t evaluate at the limit point. Rationalizing moves the square roots to the denominator where they\u2019re typically easier to handle (often approaching a nonzero value).',
      example:'lim(x\u21920) (\u221a(1+x)\u22121)/x: multiply by (\u221a(1+x)+1)/(\u221a(1+x)+1) to get x/(x(\u221a(1+x)+1)) = 1/(\u221a(1+x)+1) \u2192 1/2.'
    },
    { term:'Strategic Factoring Out', formal:'Factor out the dominant term: for large n, a\u207f + b\u207f = a\u207f(1 + (b/a)\u207f) when a > b. The parenthetical term \u2192 1.',
      intuition:'When comparing terms of different sizes, factor out the big one. What remains is 1 plus something small. This is how you find the "leading behavior" of an expression.',
      example:'(3\u207f + 2\u207f)/3\u207f = 1 + (2/3)\u207f \u2192 1, since (2/3)\u207f \u2192 0. So 3\u207f + 2\u207f grows like 3\u207f.'
    }
  ],
  explained:[
    { id:'mo1', difficulty:1, statement:'Find lim(x\u21920) (\u221a(1+x) \u2212 1)/x.',
      steps:[
        {title:'Direct substitution fails', content:'At x=0: (\u221a1 \u2212 1)/0 = 0/0. Indeterminate form. We need an algebraic trick.'},
        {title:'Multiply by the conjugate / conjugate', content:'(\u221a(1+x)\u22121)/x \u00d7 (\u221a(1+x)+1)/(\u221a(1+x)+1) = ((1+x)\u22121)/(x(\u221a(1+x)+1)) = x/(x(\u221a(1+x)+1)).'},
        {title:'Cancel and evaluate', content:'= 1/(\u221a(1+x)+1). Now substitute x=0: 1/(\u221a1+1) = 1/2. \u220e The conjugate multiplication converted the 0/0 form into something cancellable.'}
      ], answer:'1/2'
    },
    { id:'mo2', difficulty:2, statement:'Prove: \u221a(n+1) \u2212 \u221an \u2192 0.',
      steps:[
        {title:'The difference of square roots is hard to bound directly', content:'\u221a(n+1) \u2212 \u221an > 0 and should go to 0, but how fast? The conjugate trick will tell us.'},
        {title:'Multiply by conjugate', content:'\u221a(n+1)\u2212\u221an = (\u221a(n+1)\u2212\u221an)(\u221a(n+1)+\u221an)/(\u221a(n+1)+\u221an) = ((n+1)\u2212n)/(\u221a(n+1)+\u221an) = 1/(\u221a(n+1)+\u221an).'},
        {title:'Bound and conclude', content:'1/(\u221a(n+1)+\u221an) \u2264 1/(2\u221an) \u2192 0 as n\u2192\u221e. Given \u03b5>0, choose N > 1/(4\u03b5\u00b2). Then for n\u2265N: 1/(2\u221an) < \u03b5. \u220e'}
      ], answer:'\u221a(n+1)\u2212\u221an = 1/(\u221a(n+1)+\u221an) \u2192 0'
    },
    { id:'mo3', difficulty:3, statement:'Simplify and find the limit: lim(n\u2192\u221e) n(\u221a(n\u00b2+1) \u2212 n).',
      steps:[
        {title:'This is \u221e \u00b7 0 form', content:'n \u2192 \u221e and \u221a(n\u00b2+1)\u2212n \u2192 0. We need to find the exact rate. Multiply by the conjugate.'},
        {title:'Conjugate trick on the square root part', content:'n(\u221a(n\u00b2+1)\u2212n) = n \u00b7 ((n\u00b2+1)\u2212n\u00b2)/(\u221a(n\u00b2+1)+n) = n/(\u221a(n\u00b2+1)+n).'},
        {title:'Factor out n from the denominator', content:'= n/(n(\u221a(1+1/n\u00b2)+1)) = 1/(\u221a(1+1/n\u00b2)+1). This is the "factor out the dominant term" trick.'},
        {title:'Evaluate the limit', content:'As n\u2192\u221e, 1/n\u00b2 \u2192 0, so \u221a(1+1/n\u00b2) \u2192 1. The limit is 1/(1+1) = 1/2. \u220e Two tricks: conjugate multiplication, then factoring out the dominant term.'}
      ], answer:'1/2'
    },
    { id:'mo4', difficulty:4, statement:'Prove that lim(n\u2192\u221e) n\u00b9/\u207f = 1.',
      steps:[
        {title:'Write n\u00b9/\u207f = 1 + h\u2099 where h\u2099 \u2265 0', content:'Since n \u2265 1, we have n\u00b9/\u207f \u2265 1. Define h\u2099 = n\u00b9/\u207f \u2212 1 \u2265 0. We want to show h\u2099 \u2192 0. This is the "subtract 1 and study the deviation" trick.'},
        {title:'Expand using binomial inequality', content:'n = (1+h\u2099)\u207f \u2265 1 + nh\u2099 + n(n\u22121)h\u2099\u00b2/2 (by the binomial theorem, keeping only some terms). In particular, n \u2265 n(n\u22121)h\u2099\u00b2/2 for n \u2265 2.'},
        {title:'Solve for h\u2099', content:'h\u2099\u00b2 \u2264 2n/(n(n\u22121)) = 2/(n\u22121). So h\u2099 \u2264 \u221a(2/(n\u22121)) \u2192 0. \u220e'},
        {title:'The multiplying-by-1 insight', content:'By writing n\u00b9/\u207f = 1+h\u2099, we "multiplied by 1" in a structural sense: we anchored to 1 and studied the excess. Then we used the fact that (1+h)\u207f grows much faster than linearly to force h to be small.'}
      ], answer:'n\u00b9/\u207f \u2192 1 (via the substitution h\u2099 = n\u00b9/\u207f \u2212 1 and binomial bound)'
    },
    { id:'mo5', difficulty:5, statement:'Prove: if \u03a3|a\u2096| converges, then |\u03a3a\u2096| \u2264 \u03a3|a\u2096| (absolute convergence implies convergence).',
      steps:[
        {title:'The trick: shift to make everything nonnegative', content:'Define b\u2096 = a\u2096 + |a\u2096|. Then 0 \u2264 b\u2096 \u2264 2|a\u2096|. We "multiplied by 1" conceptually by writing a\u2096 = b\u2096 \u2212 |a\u2096|.'},
        {title:'Both series converge', content:'Since 0 \u2264 b\u2096 \u2264 2|a\u2096| and \u03a3|a\u2096| converges, by comparison \u03a3b\u2096 converges. Also \u03a3|a\u2096| converges by assumption.'},
        {title:'Express the original series', content:'\u03a3a\u2096 = \u03a3(b\u2096 \u2212 |a\u2096|) = \u03a3b\u2096 \u2212 \u03a3|a\u2096|. Difference of convergent series converges. \u220e'},
        {title:'Pattern recognition', content:'The trick was adding |a\u2096| to a\u2096 to make it nonnegative (multiplying the "signed" problem by a shift to create a "positive" problem). Then we decomposed the original as a difference of two convergent nonneg series.'}
      ], answer:'\u03a3a\u2096 converges via the decomposition a\u2096 = (a\u2096+|a\u2096|) \u2212 |a\u2096|'
    }
  ],
  practice:[
    { id:'mop1', difficulty:1, statement:'lim(x\u21924) (\u221ax \u2212 2)/(x \u2212 4). What trick do you use?',
      steps:[
        { question:'This is 0/0 at x=4. What algebraic trick resolves it?', options:['Multiply by (\u221ax+2)/(\u221ax+2) to rationalize','L\u2019H\u00f4pital\u2019s rule','Factor x\u22124 as (x\u22121)(x+1)','Substitute u = x\u22124'],correct:0,
          explanations:['Correct! (\u221ax\u22122)(\u221ax+2) = x\u22124, so the numerator becomes x\u22124 and cancels with the denominator.','That works too but we\'re focusing on algebraic tricks, not calculus rules.','x\u22124 = (x\u22124), and (\u221ax\u22122) is not a polynomial factor. Use the conjugate instead.','This doesn\'t resolve the square root.']},
        { question:'After rationalizing, what is the simplified expression?', options:['1/(\u221ax+2)','(\u221ax+2)/x','\u221ax/(x\u22124)','2\u221ax'],correct:0,
          explanations:['Correct! (\u221ax\u22122)/(x\u22124) \u00d7 (\u221ax+2)/(\u221ax+2) = (x\u22124)/((x\u22124)(\u221ax+2)) = 1/(\u221ax+2).','Check the algebra: numerator becomes x\u22124, denominator becomes (x\u22124)(\u221ax+2).','The (x\u22124) should cancel, not remain.','This doesn\'t match the computation.']},
        { question:'What is the limit?', options:['1/4','1/2','2','0'],correct:0,
          explanations:['Correct! As x\u21924: 1/(\u221a4+2) = 1/(2+2) = 1/4. \u220e','Careful: \u221a4 = 2, so the denominator is 2+2 = 4, not 2.','That would be \u221a4, not 1/(\u221a4+2).','The numerator and denominator both approach 0, but the ratio approaches 1/4.']}
      ]
    },
    { id:'mop2', difficulty:3, statement:'Prove that (2\u207f + 3\u207f)\u00b9/\u207f \u2192 3 as n\u2192\u221e. What is the key trick?',
      steps:[
        { question:'What should you factor out from 2\u207f + 3\u207f?', options:['3\u207f, giving 3((2/3)\u207f + 1)\u00b9/\u207f','2\u207f, giving 2(1 + (3/2)\u207f)\u00b9/\u207f','6\u207f','Nothing \u2014 use logarithms directly'],correct:0,
          explanations:['Correct! 2\u207f+3\u207f = 3\u207f((2/3)\u207f+1). Then (2\u207f+3\u207f)\u00b9/\u207f = 3\u00b7((2/3)\u207f+1)\u00b9/\u207f. Since (2/3)\u207f \u2192 0, this \u2192 3\u00b71 = 3.','This gives 2(1+(3/2)\u207f)\u00b9/\u207f where (3/2)\u207f \u2192 \u221e, which is harder to handle. Factor out the DOMINANT term.','6\u207f doesn\'t factor out of 2\u207f+3\u207f.','Logarithms work but the factoring trick is more elegant and direct.']},
        { question:'Why factor out the LARGEST base?', options:['Because then the ratio (smaller/larger)\u207f \u2192 0, simplifying to 1','Because the smallest base is always negligible','Because you must always factor out the maximum','Because it makes the exponent cancel'],correct:0,
          explanations:['Correct! If you factor out 3\u207f, the remaining (2/3)\u207f \u2192 0 since |2/3| < 1. This leaves 3\u00b7(0+1)\u00b9/\u207f = 3\u00b71 = 3.','The smallest base isn\'t always negligible (e.g., if bases are 2 and 3 vs 2.99 and 3).','It\'s a strategic choice, not a requirement. But it gives the cleanest result.','The exponent 1/n still matters: (1+0)\u00b9/\u207f = 1\u00b9/\u207f = 1.']},
        { question:'What bound proves ((2/3)\u207f+1)\u00b9/\u207f \u2192 1?', options:['1 \u2264 ((2/3)\u207f+1)\u00b9/\u207f \u2264 2\u00b9/\u207f, and 2\u00b9/\u207f \u2192 1','Use L\'H\u00f4pital on the logarithm','AM-GM inequality','Taylor expansion of (1+x)\u00b9/\u207f'],correct:0,
          explanations:['Correct! Since 0 < (2/3)\u207f < 1, we have 1 < (2/3)\u207f+1 < 2. Taking n-th roots: 1 < ((2/3)\u207f+1)\u00b9/\u207f < 2\u00b9/\u207f. Since 2\u00b9/\u207f \u2192 1, the squeeze theorem finishes it. \u220e','That works but is heavier machinery. The squeeze is cleaner.','AM-GM doesn\'t directly apply here.','Valid approach but unnecessarily complex.']}
      ]
    },
    { id:'mop3', difficulty:5, statement:'lim(n\u2192\u221e) (\u221a(n\u00b2+n) \u2212 n). Identify and execute the trick.',
      steps:[
        { question:'What is the first move?', options:['Multiply by (\u221a(n\u00b2+n)+n)/(\u221a(n\u00b2+n)+n)','Factor n\u00b2 from inside the radical','Take logarithms','Substitute m = 1/n'],correct:0,
          explanations:['Correct! This is the conjugate trick. (\u221a(n\u00b2+n)\u2212n)(\u221a(n\u00b2+n)+n)/(\u221a(n\u00b2+n)+n) = (n\u00b2+n\u2212n\u00b2)/(\u221a(n\u00b2+n)+n) = n/(\u221a(n\u00b2+n)+n).','That\'s actually the second step! After the conjugate, you\'ll factor n from the denominator.','Logarithms don\'t simplify this form.','That changes the nature of the limit.']},
        { question:'After the conjugate trick gives n/(\u221a(n\u00b2+n)+n), what next?', options:['Factor n out of \u221a(n\u00b2+n) to get n\u221a(1+1/n), then simplify','L\'H\u00f4pital\'s rule','Bound above and below','Just substitute n=\u221e'],correct:0,
          explanations:['Correct! \u221a(n\u00b2+n) = n\u221a(1+1/n). So the expression = n/(n\u221a(1+1/n)+n) = 1/(\u221a(1+1/n)+1). This is factoring out the dominant term.','We\'re doing algebra, not calculus rules.','That could work but factoring is more direct.','\u221e is not a number. We need the algebraic simplification.']},
        { question:'What is the final answer?', options:['1/2','1','0','\u221e'],correct:0,
          explanations:['Correct! 1/(\u221a(1+1/n)+1) \u2192 1/(\u221a1+1) = 1/2. \u220e Two tricks: conjugate multiplication then factoring out the dominant term n.','As n\u2192\u221e, 1/(\u221a(1+0)+1) = 1/2, not 1.','The expression approaches 1/2, not 0.','The conjugate trick showed it\'s finite.']}
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
      formal: '|a + b| ≤ |a| + |b| for all real numbers a, b',
      intuition: 'If you walk from point A to point B, the straight-line distance is never more than walking from A to some intermediate point, then to B. Taking absolute values is like measuring the actual distance traveled regardless of direction.',
      example: 'If a = 3 and b = −5, then |3 + (−5)| = |−2| = 2, while |3| + |−5| = 3 + 5 = 8. Indeed, 2 ≤ 8.'
    },
    {
      term: 'Reverse Triangle Inequality',
      formal: '||a| − |b|| ≤ |a − b| for all real numbers a, b',
      intuition: 'The difference between how "big" two numbers are is smaller than the distance between the numbers themselves. Removing absolute values from inside can only shrink the gap.',
      example: 'If a = 7 and b = 3, then ||7| − |3|| = |7 − 3| = 4, and |7 − 3| = 4. We have equality here, but consider a = −7, b = 3: ||−7| − |3|| = |7 − 3| = 4, while |−7 − 3| = 10. Indeed, 4 ≤ 10.'
    },
    {
      term: 'Iterated Triangle Inequality',
      formal: '|∑ₖ₌₁ⁿ aₖ| ≤ ∑ₖ₌₁ⁿ |aₖ| for any finite collection of real numbers a₁, a₂, …, aₙ',
      intuition: 'Adding many numbers is like taking a multi-step journey. The total distance traveled is at most the sum of each individual leg. Cancellations can make the final sum small, but the sum of absolute values counts every bit of movement.',
      example: 'If a₁ = 2, a₂ = −3, a₃ = 1, then |2 + (−3) + 1| = |0| = 0, while |2| + |−3| + |1| = 2 + 3 + 1 = 6. We have 0 ≤ 6 because the terms cancel.'
    },
    {
      term: 'ε-Splitting with Triangle Inequality',
      formal: 'For k terms, allocate ε/k to each triangle inequality application: if |aⱼ − bⱼ| < ε/k for j = 1,…,k, then |∑ⱼaⱼ − ∑ⱼbⱼ| ≤ ∑ⱼ|aⱼ − bⱼ| < k · (ε/k) = ε',
      intuition: 'When you have multiple sources of error, split your error budget equally among them. By making each piece small enough, the total stays under control—this is the ε/k trick widely used in analysis proofs.',
      example: 'To prove ∑ₖ₌₁³ aₖ → L when each aₖ → Lₖ and ∑Lₖ = L, assign error ε/3 to each term. Then the total error is at most 3 · (ε/3) = ε.'
    }
  ],
  explained: [
    {
      id: 'ti1',
      difficulty: 1,
      statement: 'Show that |a − c| ≤ |a − b| + |b − c| directly from the basic triangle inequality.',
      steps: [
        {
          title: 'Rewrite the goal',
          content: 'We want to bound |a − c|. Notice that a − c = (a − b) + (b − c), so we can rewrite |a − c| = |(a − b) + (b − c)|.'
        },
        {
          title: 'Apply triangle inequality',
          content: 'By the basic triangle inequality, |(a − b) + (b − c)| ≤ |a − b| + |b − c|.'
        },
        {
          title: 'Conclude',
          content: 'Therefore, |a − c| ≤ |a − b| + |b − c|. This is the triangle inequality for distances: the direct path from a to c is at most the path through intermediate point b.'
        }
      ],
      answer: '|a − c| = |(a − b) + (b − c)| ≤ |a − b| + |b − c| by the basic triangle inequality.'
    },
    {
      id: 'ti2',
      difficulty: 2,
      statement: 'Prove that ||aₙ| − |L|| ≤ |aₙ − L| and use it to show that if aₙ → L, then |aₙ| → |L|.',
      steps: [
        {
          title: 'Establish the reverse triangle inequality inequality',
          content: 'Start with the reverse triangle inequality: ||aₙ| − |L|| ≤ |aₙ − L|. This follows directly from the reverse triangle inequality applied to numbers aₙ and L.'
        },
        {
          title: 'Use convergence of aₙ',
          content: 'Since aₙ → L, for any ε > 0, there exists N such that for all n > N, we have |aₙ − L| < ε.'
        },
        {
          title: 'Bound |aₙ| − |L||',
          content: 'Combining the two facts: ||aₙ| − |L|| ≤ |aₙ − L| < ε for all n > N.'
        },
        {
          title: 'Conclude convergence',
          content: 'By definition of convergence, ||aₙ| − |L|| < ε for all n > N, so |aₙ| → |L|.'
        }
      ],
      answer: '||aₙ| − |L|| ≤ |aₙ − L| < ε for n sufficiently large, so |aₙ| → |L|.'
    },
    {
      id: 'ti3',
      difficulty: 3,
      statement: 'Bound |aₙbₙ − LM| using the triangle inequality after an add-subtract trick.',
      steps: [
        {
          title: 'Perform add-subtract',
          content: 'Write |aₙbₙ − LM| = |aₙbₙ − aₙM + aₙM − LM| = |(aₙ(bₙ − M) + M(aₙ − L)|. (This is the add-subtract trick from CH1.)'
        },
        {
          title: 'Apply triangle inequality',
          content: 'By the triangle inequality: |aₙ(bₙ − M) + M(aₙ − L)| ≤ |aₙ(bₙ − M)| + |M(aₙ − L)| = |aₙ||bₙ − M| + |M||aₙ − L|.'
        },
        {
          title: 'Use boundedness',
          content: 'Since aₙ → L, the sequence {aₙ} is bounded: |aₙ| ≤ K for some K. So the bound becomes K|bₙ − M| + |M||aₙ − L|.'
        },
        {
          title: 'Take the limit',
          content: 'Since bₙ → M and aₙ → L, both |bₙ − M| and |aₙ − L| approach 0, so the entire expression approaches 0. Thus aₙbₙ → LM.'
        }
      ],
      answer: '|aₙbₙ − LM| ≤ |aₙ||bₙ − M| + |M||aₙ − L| < Kε/2 + |M|ε/2 for large n.'
    },
    {
      id: 'ti4',
      difficulty: 4,
      statement: 'Prove that a uniformly convergent series of bounded functions is bounded: if |fₙ(x)| ≤ Mₙ for all x and ∑Mₙ converges, bound |∑fₙ(x)|.',
      steps: [
        {
          title: 'Apply iterated triangle inequality',
          content: 'By the iterated triangle inequality: |∑_{k=1}ⁿ fₖ(x)| ≤ ∑_{k=1}ⁿ |fₖ(x)|.'
        },
        {
          title: 'Use boundedness of each term',
          content: 'Since |fₖ(x)| ≤ Mₖ for all x, we have ∑_{k=1}ⁿ |fₖ(x)| ≤ ∑_{k=1}ⁿ Mₖ.'
        },
        {
          title: 'Use convergence of the series',
          content: 'Since ∑Mₖ converges, the partial sums ∑_{k=1}ⁿ Mₖ are bounded by some constant M (the sum of the entire series). Therefore, ∑_{k=1}ⁿ Mₖ ≤ M for all n.'
        },
        {
          title: 'Conclude boundedness',
          content: 'Combining: |∑_{k=1}ⁿ fₖ(x)| ≤ M for all n and all x. Taking the limit as n → ∞, |∑_{k=1}^∞ fₖ(x)| ≤ M.'
        }
      ],
      answer: '|∑fₙ(x)| ≤ ∑|fₙ(x)| ≤ ∑Mₙ, which converges, so the series is bounded.'
    },
    {
      id: 'ti5',
      difficulty: 5,
      statement: 'Prove the Cauchy criterion: if aₙ → L, then |aₙ − aₘ| < ε for all sufficiently large n, m. Use aₙ − L and aₘ − L as a bridge.',
      steps: [
        {
          title: 'Assume convergence',
          content: 'Assume aₙ → L. By definition, for any ε > 0, there exists N such that for all k > N, we have |aₖ − L| < ε/2.'
        },
        {
          title: 'Build the bridge with add-subtract',
          content: 'For n, m > N, write aₙ − aₘ = (aₙ − L) + (L − aₘ) = (aₙ − L) − (aₘ − L).'
        },
        {
          title: 'Apply triangle inequality',
          content: 'By the triangle inequality: |aₙ − aₘ| = |(aₙ − L) − (aₘ − L)| ≤ |aₙ − L| + |aₘ − L|.'
        },
        {
          title: 'Complete the proof',
          content: 'Since both |aₙ − L| < ε/2 and |aₘ − L| < ε/2 for n, m > N, we have |aₙ − aₘ| < ε/2 + ε/2 = ε. This is the Cauchy criterion.'
        }
      ],
      answer: '|aₙ − aₘ| ≤ |aₙ − L| + |aₘ − L| < ε/2 + ε/2 = ε for n, m sufficiently large.'
    }
  ],
  practice: [
    {
      id: 'tip1',
      difficulty: 2,
      statement: 'Apply the triangle inequality to bound |aₙ + bₙ − (L + M)| when aₙ → L and bₙ → M.',
      steps: [
        {
          question: 'How should you rewrite |aₙ + bₙ − (L + M)| to apply the triangle inequality?',
          options: [
            '|(aₙ − L) + (bₙ − M)|',
            '|(aₙ + bₙ) − (L + M)|',
            '|aₙ + bₙ| − |L + M|',
            '|(aₙ − L) · (bₙ − M)|'
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
            '|(aₙ − L) + (bₙ − M)| ≤ |aₙ − L| + |bₙ − M|',
            '|(aₙ − L) + (bₙ − M)| = |aₙ − L| + |bₙ − M|',
            '|(aₙ − L) + (bₙ − M)| ≥ |aₙ − L| + |bₙ − M|',
            '|(aₙ − L) + (bₙ − M)| < |aₙ − L| − |bₙ − M|'
          ],
          correct: 0,
          explanations: [
            'Correct! This is the basic triangle inequality applied to (aₙ − L) and (bₙ − M).',
            'Wrong: the triangle inequality is an inequality, not an equality, unless the terms have the same sign.',
            'Wrong: the triangle inequality goes the other way (≤, not ≥).',
            'Wrong: the second term should be added, not subtracted.'
          ]
        },
        {
          question: 'Given that aₙ → L and bₙ → M, and ε > 0, what can you conclude about |aₙ + bₙ − (L + M)|?',
          options: [
            'For n sufficiently large, |aₙ + bₙ − (L + M)| < ε',
            'For n sufficiently large, |aₙ + bₙ − (L + M)| ≤ |aₙ − L| + |bₙ − M| < ε/2 + ε/2 = ε',
            'The bound depends only on aₙ, not on bₙ',
            '|aₙ + bₙ − (L + M)| is always greater than ε'
          ],
          correct: 1,
          explanations: [
            'This conclusion is correct, but the reasoning shown in option 1 is more complete.',
            'Correct! By convergence, we can make each term small by the ε/2 trick, so their sum is less than ε.',
            'Wrong: both aₙ and bₙ contribute to the bound.',
            'Wrong: since aₙ → L and bₙ → M, the bound can be made arbitrarily small.'
          ]
        }
      ]
    },
    {
      id: 'tip2',
      difficulty: 3,
      statement: 'Use the reverse triangle inequality in a convergence proof: show that if |aₙ − L| → 0, then |aₙ| → |L|.',
      steps: [
        {
          question: 'Which form of the reverse triangle inequality directly compares |aₙ| and |L|?',
          options: [
            '||aₙ| − |L|| ≤ |aₙ − L|',
            '|aₙ − L| ≤ |aₙ| − |L|',
            '||aₙ| − |L|| = |aₙ − L|',
            '|aₙ + L| ≤ |aₙ| + |L|'
          ],
          correct: 0,
          explanations: [
            'Correct! The reverse triangle inequality gives an upper bound on the difference of absolute values.',
            'Wrong: this inequality is backwards and would imply |aₙ| and |L| grow as they differ, contradicting convergence.',
            'Wrong: these are equal only in special cases, not in general.',
            'Wrong: this is the basic triangle inequality, not the reverse form.'
          ]
        },
        {
          question: 'Given that |aₙ − L| < ε, what can you conclude about ||aₙ| − |L|| using the reverse triangle inequality?',
          options: [
            '||aₙ| − |L|| < ε',
            '||aₙ| − |L|| > ε',
            '||aₙ| − |L|| ≤ |aₙ − L| < ε',
            '||aₙ| − |L|| = ε'
          ],
          correct: 2,
          explanations: [
            'This is correct in conclusion but misses the explicit reasoning step through the reverse triangle inequality.',
            'Wrong: if |aₙ − L| is small, then ||aₙ| − |L|| must also be small.',
            'Correct! By the reverse triangle inequality, ||aₙ| − |L|| is bounded by |aₙ − L|, which is less than ε.',
            'Wrong: the bound is an inequality, not an equality.'
          ]
        },
        {
          question: 'To prove |aₙ| → |L|, what do you need to show for any ε > 0?',
          options: [
            'There exists N such that for all n > N, ||aₙ| − |L|| < ε',
            'There exists N such that for all n > N, |aₙ − L| = ε',
            '||aₙ| − |L|| is always less than ε, regardless of n',
            '|aₙ| equals |L| for sufficiently large n'
          ],
          correct: 0,
          explanations: [
            'Correct! This is the definition of convergence. Since ||aₙ| − |L|| ≤ |aₙ − L| < ε for n > N, the reverse triangle inequality completes the proof.',
            'Wrong: equality with ε is not what convergence requires; we need the bound to be smaller than ε.',
            'Wrong: the bound depends on ε and must be less than it, so it changes with ε.',
            'Wrong: convergence is a limit, not exact equality for finite n.'
          ]
        }
      ]
    },
    {
      id: 'tip3',
      difficulty: 3,
      statement: 'Bound the partial sum |∑_{k=1}ⁿ aₖ| using the iterated triangle inequality when |aₖ| ≤ Mₖ.',
      steps: [
        {
          question: 'What does the iterated triangle inequality say about |∑_{k=1}ⁿ aₖ|?',
          options: [
            '|∑_{k=1}ⁿ aₖ| = ∑_{k=1}ⁿ |aₖ|',
            '|∑_{k=1}ⁿ aₖ| ≤ ∑_{k=1}ⁿ |aₖ|',
            '|∑_{k=1}ⁿ aₖ| ≥ ∑_{k=1}ⁿ |aₖ|',
            '|∑_{k=1}ⁿ aₖ| < ∑_{k=1}ⁿ aₖ'
          ],
          correct: 1,
          explanations: [
            'Wrong: equality holds only if all aₖ have the same sign.',
            'Correct! The iterated triangle inequality bounds the absolute value of a sum by the sum of absolute values.',
            'Wrong: the inequality goes the other way; cancellations make the sum smaller, not larger.',
            'Wrong: absolute value makes things non-negative, so the left side is never strictly less than the right in this direction.'
          ]
        },
        {
          question: 'If |aₖ| ≤ Mₖ for all k, what is an upper bound for |∑_{k=1}ⁿ aₖ|?',
          options: [
            'The maximum of all Mₖ',
            '∑_{k=1}ⁿ Mₖ',
            '∏_{k=1}ⁿ Mₖ',
            'Mₙ'
          ],
          correct: 1,
          explanations: [
            'Wrong: the maximum of individual bounds doesn\'t account for adding multiple terms.',
            'Correct! |∑_{k=1}ⁿ aₖ| ≤ ∑_{k=1}ⁿ |aₖ| ≤ ∑_{k=1}ⁿ Mₖ by the iterated triangle inequality and the bound on each term.',
            'Wrong: we\'re adding terms, not multiplying them.',
            'Wrong: this is only the bound for the last term, not the entire sum.'
          ]
        },
        {
          question: 'In what situation would |∑_{k=1}ⁿ aₖ| be much smaller than ∑_{k=1}ⁿ Mₖ?',
          options: [
            'When all aₖ are positive',
            'When the terms aₖ have mixed signs and cancel out significantly',
            'When n is small',
            'When Mₖ is very large'
          ],
          correct: 1,
          explanations: [
            'Wrong: if all aₖ are positive, then |∑aₖ| = ∑aₖ ≤ ∑Mₖ with equality possible.',
            'Correct! When terms cancel due to opposite signs, the sum shrinks, but the iterated triangle inequality still accounts for each term\'s magnitude via Mₖ.',
            'Wrong: the size of n alone doesn\'t determine how much cancellation occurs.',
            'Wrong: large Mₖ makes the upper bound larger, not smaller.'
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
      term: 'The M-Bound Trick',
      formal: 'If aₙ → L, then there exists M > 0 such that |aₙ| ≤ M for all n ∈ ℕ. This is because aₙ is eventually within distance 1 of L, so it lies in a bounded region.',
      intuition: 'Convergent sequences don\'t blow up—they settle down. This boundedness is a fundamental property that lets you control their size and use them as factors without breaking things. Convergence ⇒ boundedness is one of your most-used tricks.',
      example: 'If aₙ → 5, then for n large enough, |aₙ − 5| < 1, so 4 < aₙ < 6. Even for small n, the sequence might hit values like 10 or −3, but you can find one M (say M = 100) such that |aₙ| ≤ 100 for all n. This M makes aₙ "controlled."'
    },
    {
      term: '"For n Sufficiently Large"',
      formal: 'Given a convergent sequence aₙ → L and ε > 0, there exists N such that for all n > N, |aₙ − L| < ε. We call n > N "sufficiently large"—past the threshold N, the sequence is close to L.',
      intuition: 'Convergence is a "tail" property: it says eventually the sequence gets close and stays close. For proving results about limits, you only care about what happens far out in the sequence, not the first few terms. This is why we often ignore the initial terms and focus on n > N.',
      example: 'If aₙ = 1 + 1/n → 1, then for ε = 0.01, we need 1/n < 0.01, so n > 100. Thus N = 100 works: for all n > 100, we have |aₙ − 1| < 0.01. The first 100 terms might oscillate wildly, but for n > 100, they\'re all within 0.01 of 1.'
    },
    {
      term: 'Monotonicity-Based Bounds',
      formal: 'If f : ℝ → ℝ is an increasing function and x ≤ y, then f(x) ≤ f(y). This allows replacing a complicated variable with a simpler bound and preserving the inequality.',
      intuition: 'Monotone functions preserve order. By choosing a simpler upper bound on your variable and applying f to the bound, you simplify the problem while keeping the direction of the inequality. This is especially useful with functions like absolute value, squaring, or logarithm.',
      example: 'If |sin(x)| ≤ 1 and you want to bound |x · sin(x)|, you can write |x · sin(x)| ≤ |x| · |sin(x)| ≤ |x| · 1 = |x|. The absolute value function is increasing on [0, ∞), so x ≤ 1 ⇒ |x| ≤ 1.'
    },
    {
      term: 'Squeeze/Comparison Bounding',
      formal: 'If 0 ≤ aₙ ≤ bₙ for all n and bₙ → 0, then aₙ → 0. More generally, if aₙ ≤ cₙ ≤ bₙ and aₙ → L, bₙ → L, then cₙ → L.',
      intuition: 'If your sequence is sandwiched between two sequences that converge to 0 (or to the same limit), then your sequence must also converge to that limit. It\'s a way of bounding a complicated sequence by simpler ones and deducing convergence without explicitly computing the limit.',
      example: 'The sequence aₙ = sin(n)/n satisfies 0 ≤ |sin(n)/n| ≤ 1/n (since |sin(n)| ≤ 1). Since 1/n → 0, the squeeze theorem implies sin(n)/n → 0. We don\'t need to know where sin(n) goes; the bound controls it.'
    }
  ],
  explained: [
    {
      id: 'b1',
      difficulty: 1,
      statement: 'Show that if aₙ → L, then the sequence {aₙ} is bounded (i.e., |aₙ| ≤ M for some M and all n).',
      steps: [
        {
          title: 'Apply the definition of convergence',
          content: 'By definition, aₙ → L means: for any ε > 0, there exists N such that for all n > N, we have |aₙ − L| < ε. Choose ε = 1.'
        },
        {
          title: 'Bound the tail',
          content: 'For n > N, we have |aₙ − L| < 1. This means L − 1 < aₙ < L + 1, so |aₙ| < |L| + 1 for all n > N.'
        },
        {
          title: 'Bound the initial segment',
          content: 'Consider the first N terms: a₁, a₂, …, aₙ. Let M₁ = max{|a₁|, |a₂|, …, |aₙ|}. This is a finite maximum, so M₁ is well-defined and finite.'
        },
        {
          title: 'Combine to get overall bound',
          content: 'Set M = max{M₁, |L| + 1}. Then |aₙ| ≤ M for all n: for n ≤ N, we have |aₙ| ≤ M₁ ≤ M, and for n > N, we have |aₙ| < |L| + 1 ≤ M. Thus {aₙ} is bounded.'
        }
      ],
      answer: 'Convergence gives a bound on the tail by ε = 1, and the initial finite segment has a finite maximum. Taking the larger of the two bounds shows {aₙ} is bounded by some M.'
    },
    {
      id: 'b2',
      difficulty: 2,
      statement: 'Prove that if aₙ → 0 and {bₙ} is a bounded sequence, then aₙbₙ → 0.',
      steps: [
        {
          title: 'Use boundedness of {bₙ}',
          content: 'Since {bₙ} is bounded, there exists M > 0 such that |bₙ| ≤ M for all n.'
        },
        {
          title: 'Use convergence of aₙ',
          content: 'Since aₙ → 0, for any ε > 0, there exists N such that for all n > N, |aₙ| < ε/M. (We choose the error budget ε/M so that multiplying by M gives ε.)'
        },
        {
          title: 'Bound the product',
          content: 'For n > N, we have |aₙbₙ| = |aₙ||bₙ| ≤ |aₙ| · M < (ε/M) · M = ε.'
        },
        {
          title: 'Conclude convergence to 0',
          content: 'By definition, |aₙbₙ| < ε for all n > N. Therefore, aₙbₙ → 0.'
        }
      ],
      answer: 'Since aₙ → 0 and |bₙ| ≤ M, we have |aₙbₙ| < (ε/M) · M = ε for large n, so aₙbₙ → 0.'
    },
    {
      id: 'b3',
      difficulty: 2,
      statement: 'Show that sin(n)/n → 0 using the bound |sin(n)| ≤ 1.',
      steps: [
        {
          title: 'Write the bound on the numerator',
          content: 'For all n, we have |sin(n)| ≤ 1. This is a well-known fact about the sine function.'
        },
        {
          title: 'Bound the fraction',
          content: 'For n > 0, divide both sides by n: |sin(n)|/n ≤ 1/n. Therefore, |sin(n)/n| ≤ 1/n.'
        },
        {
          title: 'Recognize the squeeze setup',
          content: 'We have 0 ≤ |sin(n)/n| ≤ 1/n. The sequence 1/n → 0 as n → ∞ (since for any ε > 0, choose N = ⌈1/ε⌉; then n > N implies 1/n < ε).'
        },
        {
          title: 'Apply squeeze theorem',
          content: 'By the squeeze theorem, since 0 and 1/n both squeeze |sin(n)/n|, and 1/n → 0, we have |sin(n)/n| → 0. Thus sin(n)/n → 0.'
        }
      ],
      answer: '|sin(n)/n| ≤ 1/n → 0, so by squeeze theorem, sin(n)/n → 0.'
    },
    {
      id: 'b4',
      difficulty: 3,
      statement: 'Prove that (1 + 1/n)ⁿ is bounded above by 3 using the binomial expansion and bounding.',
      steps: [
        {
          title: 'Expand using binomial theorem',
          content: '(1 + 1/n)ⁿ = ∑_{k=0}ⁿ (ⁿCₖ) (1/n)ᵏ = 1 + n·(1/n) + (ⁿC₂)(1/n)² + (ⁿC₃)(1/n)³ + … = 1 + 1 + (n(n-1)/2)/n² + (n(n-1)(n-2)/6)/n³ + …'
        },
        {
          title: 'Simplify each term',
          content: 'The general k-th term (for k ≥ 2) is (ⁿCₖ)/nᵏ = (n(n-1)…(n-k+1))/(k!·nᵏ) = 1/(k!) · (n/n)((n-1)/n)…((n-k+1)/n) ≤ 1/(k!) · 1 = 1/k!. (Each factor (n-j)/n < 1.)'
        },
        {
          title: 'Sum the series',
          content: '(1 + 1/n)ⁿ = 1 + 1 + ∑_{k=2}ⁿ (term_k) ≤ 1 + 1 + ∑_{k=2}ⁿ (1/k!) ≤ 2 + ∑_{k=2}^∞ (1/k!). The infinite series ∑_{k=0}^∞ (1/k!) is the Taylor series for e ≈ 2.718…, so ∑_{k=2}^∞ (1/k!) ≈ e − 2 < 1.'
        },
        {
          title: 'Conclude the bound',
          content: '(1 + 1/n)ⁿ ≤ 2 + (∑_{k=2}^∞ (1/k!)) < 2 + 1 = 3. Thus (1 + 1/n)ⁿ is bounded above by 3 for all n.'
        }
      ],
      answer: 'By binomial expansion and bounding each term by 1/k!, we get (1 + 1/n)ⁿ ≤ 2 + ∑_{k=2}^∞ (1/k!) < 3.'
    },
    {
      id: 'b5',
      difficulty: 4,
      statement: 'Bound the tail of a convergent series: if ∑aₙ converges (meaning the series equals some finite sum S), show that |∑_{k=N}^∞ aₖ| < ε for sufficiently large N.',
      steps: [
        {
          title: 'Define partial sums',
          content: 'Let Sₙ = ∑_{k=1}ⁿ aₖ be the n-th partial sum. By definition, ∑aₙ = lim_{n→∞} Sₙ = S (some finite limit).'
        },
        {
          title: 'Apply convergence of partial sums',
          content: 'Since Sₙ → S, for any ε > 0, there exists N such that for all m, n > N, we have |Sₙ − Sₘ| < ε. (This is the Cauchy criterion for series.)'
        },
        {
          title: 'Interpret the difference',
          content: 'For M > N, we have Sₘ − Sₙ = ∑_{k=N+1}ᵐ aₖ. So |∑_{k=N+1}ᵐ aₖ| = |Sₘ − Sₙ| < ε.'
        },
        {
          title: 'Take the limit to get the tail',
          content: 'As M → ∞, the partial sum ∑_{k=N+1}ᵐ aₖ approaches the tail ∑_{k=N+1}^∞ aₖ. By continuity of the limit, |∑_{k=N+1}^∞ aₖ| = lim_{m→∞} |∑_{k=N+1}ᵐ aₖ| ≤ ε. Therefore, for large N, the tail is bounded by ε.'
        }
      ],
      answer: 'By the Cauchy criterion and taking the limit of partial sums, |∑_{k=N}^∞ aₖ| = |S − Sₙ₋₁| < ε for large N.'
    }
  ],
  practice: [
    {
      id: 'bp1',
      difficulty: 2,
      statement: 'Bound a product where one factor converges to 0: if aₙ → 0 and |bₙ| ≤ 5 for all n, what can you say about aₙbₙ?',
      steps: [
        {
          question: 'Since aₙ → 0, what does this tell you about how to control aₙ relative to a given error ε?',
          options: [
            'For any ε > 0, there exists N such that for n > N, |aₙ| < ε',
            'For any ε > 0, there exists N such that for n > N, |aₙ| < ε/5',
            'For any ε > 0, there exists N such that for n > N, aₙ = 0 exactly',
            'aₙ is always less than 1 for all n'
          ],
          correct: 1,
          explanations: [
            'This statement is true but doesn\'t optimize for the product with bₙ. Since |bₙ| ≤ 5, you should shrink aₙ further to account for multiplication.',
            'Correct! By convergence to 0, you can make aₙ as small as you like. To ensure |aₙbₙ| < ε after multiplying by at most 5, choose |aₙ| < ε/5.',
            'Wrong: convergence to 0 doesn\'t mean exact 0; it means arbitrarily close.',
            'Wrong: convergence to 0 means aₙ → 0, not that aₙ < 1.'
          ]
        },
        {
          question: 'Given |bₙ| ≤ 5 and |aₙ| < ε/5 for large n, what is the bound on |aₙbₙ|?',
          options: [
            '|aₙbₙ| < ε/5',
            '|aₙbₙ| < ε',
            '|aₙbₙ| < 5ε',
            '|aₙbₙ| ≤ 25'
          ],
          correct: 1,
          explanations: [
            'Wrong: you need to multiply the bounds by 5 to get the product bound.',
            'Correct! |aₙbₙ| = |aₙ||bₙ| < (ε/5) · 5 = ε.',
            'Wrong: you divided rather than multiplied; the bound should shrink, not grow.',
            'Wrong: this bound doesn\'t use the convergence of aₙ and depends only on the bound on bₙ.'
          ]
        },
        {
          question: 'What is the correct conclusion about aₙbₙ?',
          options: [
            'aₙbₙ → 0',
            'aₙbₙ → 5',
            'aₙbₙ → ∞',
            'aₙbₙ is bounded but might not converge'
          ],
          correct: 0,
          explanations: [
            'Correct! Since |aₙbₙ| < ε for large n and ε is arbitrary, aₙbₙ → 0.',
            'Wrong: if aₙ → 0, then aₙbₙ → 0 · (anything) = 0, not 5.',
            'Wrong: |aₙbₙ| is bounded by ε, which goes to 0.',
            'Wrong: the product converges to 0, not just stays bounded.'
          ]
        }
      ]
    },
    {
      id: 'bp2',
      difficulty: 2,
      statement: 'Use "for n sufficiently large" to simplify an expression: if aₙ = 1 + 1/n and you want |aₙ − 1| < 0.1, what N works?',
      steps: [
        {
          question: 'What is |aₙ − 1| in terms of n?',
          options: [
            '|aₙ − 1| = 1/n',
            '|aₙ − 1| = n',
            '|aₙ − 1| = 1 + 1/n',
            '|aₙ − 1| = −1/n'
          ],
          correct: 0,
          explanations: [
            'Correct! Since aₙ = 1 + 1/n, we have aₙ − 1 = 1/n, so |aₙ − 1| = 1/n.',
            'Wrong: this is the reciprocal; aₙ − 1 = 1/n, not n.',
            'Wrong: this is aₙ itself, not the difference from the limit 1.',
            'Wrong: 1/n is positive, so the absolute value is 1/n, not −1/n.'
          ]
        },
        {
          question: 'To satisfy |aₙ − 1| < 0.1, we need 1/n < 0.1. What condition on n is this equivalent to?',
          options: [
            'n < 0.1',
            'n > 10',
            'n > 0.1',
            'n < 10'
          ],
          correct: 1,
          explanations: [
            'Wrong: if 1/n < 0.1, we divide both sides by 1 and flip the inequality: n > 1/0.1 = 10.',
            'Correct! Rearranging 1/n < 0.1 gives n > 10.',
            'Wrong: this is too weak; we need n > 10 to make 1/n small enough.',
            'Wrong: this would make 1/n large, not small.'
          ]
        },
        {
          question: 'What is the smallest integer N that works (i.e., for all n > N, |aₙ − 1| < 0.1)?',
          options: [
            'N = 0.1',
            'N = 1',
            'N = 9',
            'N = 10'
          ],
          correct: 2,
          explanations: [
            'Wrong: N must be an integer.',
            'Wrong: for n = 1, we have 1/1 = 1, which is not less than 0.1.',
            'Correct! For n > 9, we have n ≥ 10, so 1/n ≤ 1/10 = 0.1. Thus N = 9 ensures |aₙ − 1| < 0.1 for all n > 9.',
            'Wrong: for n = 10, we have 1/n = 0.1, which is not strictly less than 0.1. We need n > 10, so N = 10 doesn\'t guarantee n > 10 (only n ≥ 11).'
          ]
        }
      ]
    },
    {
      id: 'bp3',
      difficulty: 3,
      statement: 'Squeeze theorem application: show that n·cos(n)/n² → 0 by squeezing it between simpler bounds.',
      steps: [
        {
          question: 'What is the bound on |cos(n)| for all n?',
          options: [
            '|cos(n)| ≤ 0',
            '|cos(n)| ≤ 1',
            '|cos(n)| ≤ n',
            '|cos(n)| ≤ 2'
          ],
          correct: 1,
          explanations: [
            'Wrong: cosine is not always 0.',
            'Correct! The cosine function is bounded: −1 ≤ cos(n) ≤ 1, so |cos(n)| ≤ 1.',
            'Wrong: cosine is bounded between −1 and 1, much smaller than n for large n.',
            'Wrong: the bound is ±1, not ±2.'
          ]
        },
        {
          question: 'Using |cos(n)| ≤ 1, what is an upper bound on |n·cos(n)/n²|?',
          options: [
            '|n·cos(n)/n²| ≤ 1/n',
            '|n·cos(n)/n²| ≤ n',
            '|n·cos(n)/n²| ≤ 1',
            '|n·cos(n)/n²| ≤ cos(n)'
          ],
          correct: 0,
          explanations: [
            'Correct! Since |cos(n)| ≤ 1, we have |n·cos(n)/n²| = (n/n²)·|cos(n)| ≤ (1/n)·1 = 1/n.',
            'Wrong: you need to divide by n², not multiply.',
            'Wrong: 1/n goes to 0, but 1/n² (which gives the bound 1/n) is even smaller and still approaches 0.',
            'Wrong: this doesn\'t simplify the expression to use the convergence of 1/n.'
          ]
        },
        {
          question: 'What can you conclude about n·cos(n)/n² using the fact that 1/n → 0 and 0 ≤ |n·cos(n)/n²| ≤ 1/n?',
          options: [
            'n·cos(n)/n² → 1',
            'n·cos(n)/n² → 0',
            'n·cos(n)/n² → ∞',
            'n·cos(n)/n² is unbounded'
          ],
          correct: 1,
          explanations: [
            'Wrong: the upper bound 1/n → 0, not 1.',
            'Correct! By the squeeze theorem, since 0 ≤ |n·cos(n)/n²| ≤ 1/n and 1/n → 0, we have |n·cos(n)/n²| → 0, so n·cos(n)/n² → 0.',
            'Wrong: the expression is bounded above by 1/n, which shrinks to 0.',
            'Wrong: 1/n is a strict upper bound that decreases to 0.'
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
      formal: 'aⁿ − bⁿ = (a − b)(aⁿ⁻¹ + aⁿ⁻²b + aⁿ⁻³b² + ... + bⁿ⁻¹) for all n ∈ ℕ',
      intuition: 'A high power difference always has a linear factor. This formula shows how to extract the difference in the bases, leaving a sum of cross-products. It\'s like "unraveling" the power through factorization.',
      example: 'x³ − 8 = x³ − 2³ = (x − 2)(x² + 2x + 4). Or for limits: (aₙ² − L²) = (aₙ − L)(aₙ + L), so if aₙ → L, then aₙ² → L² since aₙ + L → 2L.'
    },
    {
      term: 'Common Factor Extraction',
      formal: 'Extract the leading term from a sum to isolate dominant behavior: nᵖ(f(n) + o(1)) for polynomial or exponential leading terms',
      intuition: 'When analyzing limits of ratios, pull out the term that "wins" in size (grows fastest). The remaining terms become negligible, making the limit transparent.',
      example: 'n² + n = n²(1 + 1/n), so lim(n² + n)/(2n²) = lim n²(1 + 1/n)/(2n²) = lim(1 + 1/n)/2 = 1/2. The dominant term n² cancels.'
    },
    {
      term: 'Partial Fraction Decomposition',
      formal: 'A rational function can be written as a sum of simpler fractions: 1/(k(k+1)) = A/k + B/(k+1) where A and B are constants.',
      intuition: 'Convert a complicated fraction into pieces you already understand. Often reveals a telescoping structure where consecutive terms cancel.',
      example: '1/(k(k+1)) = 1/k − 1/(k+1). So ∑ₖ₌₁ⁿ 1/(k(k+1)) = ∑ₖ₌₁ⁿ (1/k − 1/(k+1)) = 1 − 1/(n+1) → 1 as n → ∞.'
    },
    {
      term: 'Completing the Square',
      formal: 'x² + bx + c = (x + b/2)² − b²/4 + c = (x + b/2)² − (b² − 4c)/4',
      intuition: 'Rewrite a quadratic to expose a perfect square plus a constant. Isolates the minimum or maximum and reveals the quadratic\'s geometry.',
      example: 'x² + 2x = (x + 1)² − 1. Or for proving AM-GM: x² + y² = (x − y)² + 2xy ≥ 2xy (since (x−y)² ≥ 0), so x² + y² ≥ 2xy.'
    }
  ],
  explained: [
    {
      id: 'f1',
      difficulty: 1,
      statement: 'Use the difference of squares formula to simplify (aₙ² − L²) and prove: if aₙ → L, then aₙ² → L².',
      steps: [
        {
          title: 'Factor the difference of squares',
          content: 'Apply aⁿ − bⁿ factorization with n = 2: aₙ² − L² = (aₙ − L)(aₙ + L)'
        },
        {
          title: 'Bound the second factor',
          content: 'Since aₙ → L, there exists N such that for n > N: |aₙ − L| < 1. This means L − 1 < aₙ < L + 1, so aₙ + L is bounded: |aₙ + L| < 2|L| + 1 (or some constant M).'
        },
        {
          title: 'Combine the bounds',
          content: '|aₙ² − L²| = |aₙ − L| · |aₙ + L| < |aₙ − L| · M. Since aₙ → L, we have |aₙ − L| → 0, so |aₙ² − L²| → 0.'
        },
        {
          title: 'Conclude convergence',
          content: '|aₙ² − L²| → 0 means aₙ² → L². This completes the proof that squaring preserves limits.'
        }
      ],
      answer: 'aₙ² − L² = (aₙ − L)(aₙ + L). The first factor goes to zero (by hypothesis), and the second factor is bounded (since aₙ → L stays near L). Their product goes to zero, so aₙ² → L².'
    },
    {
      id: 'f2',
      difficulty: 2,
      statement: 'Factor n² + n as n²(1 + 1/n) and use this to find lim(n² + n)/(2n² + 3) as n → ∞.',
      steps: [
        {
          title: 'Extract the common factor from numerator',
          content: 'n² + n = n²(1 + 1/n). This isolates the dominant term n² and shows the remainder 1/n → 0.'
        },
        {
          title: 'Extract the common factor from denominator',
          content: '2n² + 3 = n²(2 + 3/n²). Similarly, the dominant term is n² with remainder 3/n² → 0.'
        },
        {
          title: 'Simplify the ratio',
          content: '(n² + n)/(2n² + 3) = [n²(1 + 1/n)]/[n²(2 + 3/n²)] = (1 + 1/n)/(2 + 3/n²)'
        },
        {
          title: 'Take the limit',
          content: 'lim(1 + 1/n)/(2 + 3/n²) = (1 + 0)/(2 + 0) = 1/2 as n → ∞, since 1/n → 0 and 3/n² → 0.'
        }
      ],
      answer: '(n² + n)/(2n² + 3) = (1 + 1/n)/(2 + 3/n²) → 1/2 as n → ∞.'
    },
    {
      id: 'f3',
      difficulty: 3,
      statement: 'Use partial fraction decomposition to evaluate ∑ₖ₌₁ⁿ 1/(k² + 3k + 2) as a telescoping sum and find its limit as n → ∞.',
      steps: [
        {
          title: 'Factor the denominator',
          content: 'k² + 3k + 2 = (k + 1)(k + 2). We need to decompose 1/[(k+1)(k+2)].'
        },
        {
          title: 'Set up and solve partial fractions',
          content: '1/[(k+1)(k+2)] = A/(k+1) + B/(k+2). Multiply by (k+1)(k+2): 1 = A(k+2) + B(k+1). Setting k = −1: 1 = A(1), so A = 1. Setting k = −2: 1 = B(−1), so B = −1. Thus 1/[(k+1)(k+2)] = 1/(k+1) − 1/(k+2).'
        },
        {
          title: 'Write out the telescoping sum',
          content: '∑ₖ₌₁ⁿ [1/(k+1) − 1/(k+2)] = [1/2 − 1/3] + [1/3 − 1/4] + [1/4 − 1/5] + ... + [1/(n+1) − 1/(n+2)]. Most terms cancel: = 1/2 − 1/(n+2).'
        },
        {
          title: 'Find the limit',
          content: 'lim(n→∞) [1/2 − 1/(n+2)] = 1/2 − 0 = 1/2. The sum converges to 1/2.'
        }
      ],
      answer: '∑ₖ₌₁ⁿ 1/(k² + 3k + 2) = 1/2 − 1/(n+2) → 1/2 as n → ∞, achieved by decomposing 1/[(k+1)(k+2)] = 1/(k+1) − 1/(k+2) and observing the telescoping.'
    },
    {
      id: 'f4',
      difficulty: 4,
      statement: 'Factor xⁿ − yⁿ to prove that if aₙ → L, then aₙⁿ → Lⁿ for fixed n ∈ ℕ.',
      steps: [
        {
          title: 'Apply the difference of powers formula',
          content: 'aₙⁿ − Lⁿ = (aₙ − L)(aₙⁿ⁻¹ + aₙⁿ⁻²L + aₙⁿ⁻³L² + ... + Lⁿ⁻¹) by the factorization aⁿ − bⁿ = (a − b)·(sum of cross-products).'
        },
        {
          title: 'Bound the second factor',
          content: 'Since aₙ → L, there exists N such that for n > N: |aₙ − L| < 1, so |aₙ| < |L| + 1. The sum has n terms, each bounded by (|L| + 1)ⁿ⁻¹ in absolute value. Thus |aₙⁿ⁻¹ + ... + Lⁿ⁻¹| ≤ n(|L| + 1)ⁿ⁻¹ =: M (a fixed multiple for large n).'
        },
        {
          title: 'Combine bounds',
          content: '|aₙⁿ − Lⁿ| = |aₙ − L| · |aₙⁿ⁻¹ + ... + Lⁿ⁻¹| ≤ |aₙ − L| · M. Since aₙ → L, we have |aₙ − L| → 0, so |aₙⁿ − Lⁿ| → 0.'
        },
        {
          title: 'Conclude',
          content: '|aₙⁿ − Lⁿ| → 0, hence aₙⁿ → Lⁿ. This proves that continuous functions like f(x) = xⁿ preserve limits.'
        }
      ],
      answer: 'The factorization aₙⁿ − Lⁿ = (aₙ − L) · P(aₙ, L) where P is a polynomial sum bounded as aₙ stays near L. Since the first factor aₙ − L → 0 and the second is bounded, their product → 0, giving aₙⁿ → Lⁿ.'
    },
    {
      id: 'f5',
      difficulty: 5,
      statement: 'Complete the square to prove x² + y² ≥ 2xy, and use this to show (a + b)² ≥ 4ab for positive a, b.',
      steps: [
        {
          title: 'Rearrange and complete the square',
          content: 'x² + y² − 2xy = x² − 2xy + y² = (x − y)². Since (x − y)² ≥ 0 for all real x, y, we have x² + y² − 2xy ≥ 0, so x² + y² ≥ 2xy.'
        },
        {
          title: 'Apply to (a + b)²',
          content: 'Expand: (a + b)² = a² + 2ab + b². From the inequality above with x = a and y = b: a² + b² ≥ 2ab, so (a + b)² = a² + 2ab + b² ≥ 2ab + 2ab = 4ab.'
        },
        {
          title: 'Interpret the result',
          content: '(a + b)² ≥ 4ab is equivalent to (a + b)/2 ≥ √(ab), the AM-GM inequality for two positive numbers. The arithmetic mean dominates the geometric mean.'
        },
        {
          title: 'Use in limits context',
          content: 'If aₙ → L and bₙ → M both positive, then (aₙ + bₙ)² ≥ 4aₙbₙ for all n. Taking limits: (L + M)² ≥ 4LM, proving the AM-GM inequality in the limit.'
        }
      ],
      answer: 'The inequality x² + y² ≥ 2xy follows from (x − y)² ≥ 0. Applying x = a, y = b and expanding (a+b)² yields (a+b)² ≥ 4ab, the AM-GM inequality. This plays a key role in bounding convergent sequences.'
    }
  ],
  practice: [
    {
      id: 'fp1',
      difficulty: 2,
      statement: 'Factor aₙ³ − L³ to prove that if aₙ → L, then aₙ³ → L³.',
      steps: [
        {
          question: 'Which factorization applies to aₙ³ − L³?',
          options: [
            '(aₙ − L)(aₙ² + aₙL + L²)',
            '(aₙ − L)³',
            '(aₙ − L)(aₙ + L)²',
            'aₙ(aₙ² − L²) − L³'
          ],
          correct: 0,
          explanations: [
            'Correct! This is a³ − b³ = (a − b)(a² + ab + b²), so aₙ³ − L³ = (aₙ − L)(aₙ² + aₙL + L²).',
            'Wrong. (aₙ − L)³ expands to aₙ³ − 3aₙ²L + 3aₙL² − L³, which is not equal to aₙ³ − L³.',
            'Wrong. (aₙ − L)(aₙ + L)² = (aₙ − L)(aₙ² + 2aₙL + L²), which is not the correct factorization for the difference of cubes.',
            'Wrong. This is a partial factorization but not the standard form. The correct form isolates (aₙ − L) as a single factor.'
          ]
        },
        {
          question: 'If aₙ → L, which term in (aₙ − L)(aₙ² + aₙL + L²) goes to zero?',
          options: [
            'The term (aₙ − L) goes to zero; the sum (aₙ² + aₙL + L²) stays bounded near 3L².',
            'The entire product goes to zero immediately.',
            'Both factors must go to zero simultaneously.',
            'Only aₙ² goes to zero in the second factor.'
          ],
          correct: 0,
          explanations: [
            'Correct! Since aₙ → L, we have aₙ − L → 0. The second factor aₙ² + aₙL + L² approaches L² + L·L + L² = 3L² (a bounded constant). So the product → 0 · (finite) = 0.',
            'Wrong. The product approaches 0 · (bounded constant) = 0, but it\'s specifically the first factor that vanishes.',
            'Wrong. The second factor does not go to zero; it approaches 3L². Only the first factor vanishes.',
            'Wrong. In the second factor, aₙ² → L², not 0, and L is a fixed constant. The second factor as a whole stays bounded.'
          ]
        },
        {
          question: 'What is the conclusion from |aₙ³ − L³| = |aₙ − L| · |aₙ² + aₙL + L²| with the bounds above?',
          options: [
            'Since |aₙ − L| → 0 and |aₙ² + aₙL + L²| is bounded by 3L² + ε for small ε, we have |aₙ³ − L³| → 0, so aₙ³ → L³.',
            'The product can never go to zero because L ≠ 0.',
            'We need to show that both factors go to zero separately.',
            'The inequality does not provide enough information to conclude convergence.'
          ],
          correct: 0,
          explanations: [
            'Correct! The product of a term → 0 and a bounded term is 0. Therefore |aₙ³ − L³| → 0, which means aₙ³ → L³. This is a standard technique: a vanishing factor times a bounded factor vanishes.',
            'Wrong. The fact that L ≠ 0 is irrelevant; the second factor remains bounded either way. A bounded factor times a vanishing factor still vanishes.',
            'Wrong. Only the first factor needs to vanish. A term going to zero multiplied by any bounded constant also goes to zero.',
            'Wrong. The factorization and bounds together are sufficient. We have a rigorous squeeze-type argument: 0 ≤ |aₙ³ − L³| ≤ |aₙ − L| · M → 0.'
          ]
        }
      ]
    },
    {
      id: 'fp2',
      difficulty: 2,
      statement: 'Extract the dominant term from (3n² + 5n)/(n² − 2) and evaluate the limit as n → ∞.',
      steps: [
        {
          question: 'What is the dominant (leading) term in the numerator 3n² + 5n?',
          options: [
            '3n² (the highest degree term)',
            '5n (the linear term)',
            'Both equally, since 3 > 5 is false',
            'The denominator overrides the numerator\'s dominance'
          ],
          correct: 0,
          explanations: [
            'Correct! For large n, the term 3n² grows much faster than 5n (quadratic beats linear). So 3n² + 5n ≈ 3n² for large n.',
            'Wrong. The linear term 5n grows slower than the quadratic 3n². Quadratic terms dominate linear terms.',
            'Wrong. The dominance is determined by the degree (power of n), not the coefficient. The n² term dominates.',
            'Wrong. We first simplify the numerator and denominator separately before comparing them.'
          ]
        },
        {
          question: 'Factor out n² from both numerator and denominator to rewrite the fraction.',
          options: [
            '(3 + 5/n)/(1 − 2/n²)',
            '(3n + 5)/(n − 2/n)',
            '3n²(1 + 5/3n) / n²(1 − 2/n²) = (1 + 5/3n)/(1 − 2/n²)',
            '(3 + 5/n) / (1 + 2/n²)'
          ],
          correct: 0,
          explanations: [
            'Correct! (3n² + 5n)/(n² − 2) = [n²(3 + 5/n)]/[n²(1 − 2/n²)] = (3 + 5/n)/(1 − 2/n²). The n² factors cancel.',
            'Wrong. This extracts n from the numerator only, leaving n in the denominator. We need to factor n² from both.',
            'Wrong. While the final form (1 + 5/3n)/(1 − 2/n²) is correct after canceling n², the intermediate step shown is redundant and confusing.',
            'Wrong. The denominator should be (1 − 2/n²), not (1 + 2/n²). Factoring n² from n² − 2 gives n²(1 − 2/n²).'
          ]
        },
        {
          question: 'What is lim(3 + 5/n)/(1 − 2/n²) as n → ∞?',
          options: [
            '3 (since 5/n → 0 and 2/n² → 0, leaving 3/1 = 3)',
            '5/2 (the ratio of the linear coefficient to the constant)',
            '∞ (the numerator is larger)',
            '1 (the middle term dominates)'
          ],
          correct: 0,
          explanations: [
            'Correct! As n → ∞, we have 5/n → 0 and 2/n² → 0. So (3 + 5/n)/(1 − 2/n²) → (3 + 0)/(1 − 0) = 3/1 = 3.',
            'Wrong. The ratio 5/2 was perhaps guessed, but 5 is a coefficient in the linear term, not the leading term. Leading terms dominate, and 3 is the leading coefficient.',
            'Wrong. The limit is finite, not infinite. Both the numerator and denominator have the same degree (n²), so the ratio approaches a finite number.',
            'Wrong. There is no "middle term" dominance here. As n → ∞, the lower-order terms (5/n and 2/n²) vanish, leaving the ratio of leading coefficients: 3/1 = 3.'
          ]
        }
      ]
    },
    {
      id: 'fp3',
      difficulty: 3,
      statement: 'Apply partial fraction decomposition to 1/(k(k+2)) and use it to evaluate ∑ₖ₌₁ⁿ 1/(k(k+2)) as a telescoping series.',
      steps: [
        {
          question: 'Set up the partial fraction decomposition for 1/(k(k+2)). What are A and B in 1/(k(k+2)) = A/k + B/(k+2)?',
          options: [
            'A = 1/2, B = −1/2',
            'A = 1, B = 1',
            'A = −1/2, B = 1/2',
            'A = 2, B = −2'
          ],
          correct: 0,
          explanations: [
            'Correct! Multiply by k(k+2): 1 = A(k+2) + Bk. Set k = 0: 1 = 2A, so A = 1/2. Set k = −2: 1 = −2B, so B = −1/2.',
            'Wrong. With A = 1 and B = 1, we get k(k+2) = k + (k+2) = 2k + 2 in the denominator, which doesn\'t equal 1 when cleared.',
            'Wrong. The signs are flipped. Check: with A = −1/2 and B = 1/2, at k = 0 we get 1 = −1/2 · 2 = −1, which is false.',
            'Wrong. With A = 2 and B = −2, the numerator becomes 2(k+2) − 2k = 4, not 1.'
          ]
        },
        {
          question: 'Rewrite the sum ∑ₖ₌₁ⁿ 1/(k(k+2)) using the decomposition 1/(k(k+2)) = (1/2)[1/k − 1/(k+2)].',
          options: [
            '(1/2)∑ₖ₌₁ⁿ [1/k − 1/(k+2)]',
            '∑ₖ₌₁ⁿ [1/k − 1/(k+2)]',
            '(1/2)∑ₖ₌₁ⁿ [1/k + 1/(k+2)]',
            '∑ₖ₌₁ⁿ 1/k · 1/(k+2)'
          ],
          correct: 0,
          explanations: [
            'Correct! Factor out the 1/2 and expand the sum: (1/2)[1/1 − 1/3 + 1/2 − 1/4 + 1/3 − 1/5 + ... + 1/n − 1/(n+2)].',
            'Wrong. The factor 1/2 must be included from the decomposition. You cannot drop it.',
            'Wrong. The decomposition has a minus sign, not a plus sign: 1/(k(k+2)) = (1/2)[1/k − 1/(k+2)], not (1/2)[1/k + 1/(k+2)].',
            'Wrong. This is a product of fractions, not a sum. The partial fraction decomposition gives a difference (subtraction).'
          ]
        },
        {
          question: 'Write out the first few and last few terms of (1/2)∑ₖ₌₁ⁿ [1/k − 1/(k+2)] to identify which terms survive (telescoping).',
          options: [
            '(1/2)[1 + 1/2 − 1/(n+1) − 1/(n+2)]',
            '(1/2)[1 − 1/(n+2)]',
            '(1/2)[1 + 1/2 − 1/n − 1/(n+1)]',
            '(1/2)[2n − 1]'
          ],
          correct: 0,
          explanations: [
            'Correct! The sum telescopes: (1/2)[1/1 − 1/3 + 1/2 − 1/4 + 1/3 − 1/5 + ...]. The 1/3 from k=1 cancels with −1/3 from k=3, etc. What survives: 1 + 1/2 from the start and −1/(n+1) − 1/(n+2) from the end.',
            'Wrong. This is incomplete. The first two positive terms 1 and 1/2 don\'t cancel with anything; they survive. Include them.',
            'Wrong. This misses 1/2 and includes 1/n which actually cancels. Trace through carefully: k=1 gives 1/1 − 1/3; k=2 gives 1/2 − 1/4; k=n gives 1/n − 1/(n+2).',
            'Wrong. This is a formula, not a telescoping expansion. Telescoping sums leave specific surviving terms, not a linear formula in n.'
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
      formal: 'For sequences {aₙ} with n → ∞, substitute h = 1/n (so h → 0⁺). Convert sequence limits to function limits: lim(n→∞) f(n) = lim(h→0⁺) f(1/h).',
      intuition: 'As n grows large (n → ∞), the reciprocal h = 1/n shrinks (h → 0). This "inverts" the behavior and often converts complicated sequence problems into familiar function limits near zero.',
      example: 'lim(n→∞) (1 + 1/n)ⁿ. Substitute h = 1/n, so n = 1/h and (1 + h)^(1/h). Now as n → ∞, h → 0⁺, and we ask for lim(h→0⁺) (1 + h)^(1/h), a classic limit equaling e.'
    },
    {
      term: 'Centering at the Limit',
      formal: 'If aₙ → L, define εₙ = aₙ − L so aₙ = L + εₙ with εₙ → 0. Rewrite expressions in terms of εₙ to expose the convergence.',
      intuition: 'Instead of thinking of aₙ as an arbitrary sequence approaching L, explicitly track the error εₙ from the limit. This isolates the "deviation" and makes algebraic manipulations clearer.',
      example: 'Prove √aₙ → √L for aₙ → L > 0. Write aₙ = L + εₙ, so √aₙ − √L = (√(L+εₙ) − √L). Rationalize: multiply by (√(L+εₙ) + √L) / (√(L+εₙ) + √L) to get εₙ / (√(L+εₙ) + √L) → 0 as εₙ → 0.'
    },
    {
      term: 'Exponential-Log Bridge',
      formal: 'To handle expressions aₙ^(bₙ), write aₙ^(bₙ) = exp(bₙ ln(aₙ)). Converts multiplication (the exponent bₙ times aₙ) into the product bₙ ln(aₙ), which may telescope or simplify via Taylor series.',
      intuition: 'Exponentials and logs are "dual" operations that convert products into sums and exponents into products. Use them to linearize complicated power expressions, especially with exponential growth.',
      example: '(1 + 3/n)ⁿ = exp(n ln(1 + 3/n)). For large n, ln(1 + 3/n) ≈ 3/n (Taylor series), so n ln(1 + 3/n) ≈ 3, giving (1 + 3/n)ⁿ → e³.'
    },
    {
      term: 'Change of Index',
      formal: 'For sums or sequences with awkward indexing, re-index by substituting j = f(k) (e.g., j = n − k or j = k − 1). Transform ∑ₖ to ∑ⱼ with simpler limits or a clearer pattern.',
      intuition: 'Indexing is a labeling choice. By relabeling (e.g., counting from the end instead of the start), you can reveal hidden structure, combine sums, or expose telescoping.',
      example: 'The double sum ∑ₖ₌₁ⁿ ∑ⱼ₌ₖⁿ aⱼ (sum over all pairs (k, j) with 1 ≤ k ≤ j ≤ n) can be reindexed to ∑ⱼ₌₁ⁿ ∑ₖ₌₁ʲ aⱼ by swapping the order of summation, which may be easier to compute.'
    }
  ],
  explained: [
    {
      id: 's1',
      difficulty: 1,
      statement: 'Evaluate lim(n→∞) (1 + 1/n)ⁿ by substituting h = 1/n and using the exponential-log bridge.',
      steps: [
        {
          title: 'Apply the reciprocal substitution',
          content: 'Let h = 1/n. As n → ∞, h → 0⁺. Also, n = 1/h, so (1 + 1/n)ⁿ = (1 + h)^(1/h).'
        },
        {
          title: 'Use the exponential-log bridge',
          content: '(1 + h)^(1/h) = exp((1/h) ln(1 + h)) = exp(ln(1 + h) / h). Now we need to find lim(h→0) ln(1 + h) / h.'
        },
        {
          title: 'Apply L\'Hôpital or Taylor series',
          content: 'By L\'Hôpital\'s rule: lim(h→0) ln(1 + h) / h = lim(h→0) [1/(1+h)] / 1 = 1. Alternatively, Taylor: ln(1 + h) = h − h²/2 + h³/3 − ..., so ln(1 + h) / h = 1 − h/2 + h²/3 − ... → 1.'
        },
        {
          title: 'Exponentiate to find the limit',
          content: 'Since ln(1 + h) / h → 1, we have exp(ln(1 + h) / h) → exp(1) = e. Therefore, (1 + 1/n)ⁿ → e as n → ∞.'
        }
      ],
      answer: 'By substituting h = 1/n, the expression becomes (1 + h)^(1/h). Taking logs: (1/h) ln(1 + h). As h → 0, ln(1 + h) / h → 1 (by Taylor or L\'Hôpital). Thus exp(1) = e.'
    },
    {
      id: 's2',
      difficulty: 2,
      statement: 'Prove that (1 + x/n)ⁿ → eˣ as n → ∞ using the exponential-log bridge and Taylor approximation ln(1 + y) ≈ y.',
      steps: [
        {
          title: 'Apply the exponential-log bridge',
          content: '(1 + x/n)ⁿ = exp(n ln(1 + x/n)). We need to evaluate lim(n→∞) n ln(1 + x/n).'
        },
        {
          title: 'Substitute y = x/n and use Taylor',
          content: 'As n → ∞, y = x/n → 0. By Taylor series, ln(1 + y) = y − y²/2 + y³/3 − ... ≈ y for small y. So ln(1 + x/n) ≈ x/n (keeping only the leading term).'
        },
        {
          title: 'Multiply by n',
          content: 'n ln(1 + x/n) ≈ n · (x/n) = x. More precisely, n ln(1 + x/n) = n[x/n − (x/n)²/2 + O((x/n)³)] = x − x²/(2n) + O(x³/n²) → x as n → ∞.'
        },
        {
          title: 'Exponentiate',
          content: '(1 + x/n)ⁿ = exp(n ln(1 + x/n)) → exp(x) = eˣ as n → ∞.'
        }
      ],
      answer: 'Writing (1 + x/n)ⁿ = exp(n ln(1 + x/n)) and using ln(1 + x/n) ≈ x/n, we get n ln(1 + x/n) → x. Thus (1 + x/n)ⁿ → eˣ.'
    },
    {
      id: 's3',
      difficulty: 3,
      statement: 'Use the substitution εₙ = aₙ − L (centering at the limit) to prove: if aₙ → L > 0, then √aₙ → √L.',
      steps: [
        {
          title: 'Set up the centered substitution',
          content: 'Write aₙ = L + εₙ where εₙ = aₙ − L. Since aₙ → L, we have εₙ → 0. Thus √aₙ = √(L + εₙ).'
        },
        {
          title: 'Express the error in the limit',
          content: '√aₙ − √L = √(L + εₙ) − √L. To simplify, rationalize by multiplying by the conjugate (√(L + εₙ) + √L) / (√(L + εₙ) + √L).'
        },
        {
          title: 'Rationalize and simplify',
          content: '(√(L + εₙ) − √L) · (√(L + εₙ) + √L) / (√(L + εₙ) + √L) = [(L + εₙ) − L] / (√(L + εₙ) + √L) = εₙ / (√(L + εₙ) + √L).'
        },
        {
          title: 'Take the limit',
          content: 'As n → ∞, εₙ → 0, so √(L + εₙ) → √L. Thus √(L + εₙ) + √L → 2√L (a positive constant). Therefore, |√aₙ − √L| = |εₙ| / |√(L + εₙ) + √L| → 0 / (2√L) = 0, so √aₙ → √L.'
        }
      ],
      answer: 'Centering at L: write aₙ = L + εₙ, so √aₙ − √L = εₙ / (√(L + εₙ) + √L). As εₙ → 0, the denominator stays ≥ √L (bounded away from 0), and the numerator → 0. Thus √aₙ → √L.'
    },
    {
      id: 's4',
      difficulty: 4,
      statement: 'Re-index the double sum ∑ₖ₌₁ⁿ ∑ⱼ₌ₖⁿ aⱼ by switching the order of summation to ∑ⱼ₌₁ⁿ ∑ₖ₌₁ʲ aⱼ and verify they are equal.',
      steps: [
        {
          title: 'Identify the region of summation',
          content: 'The original sum ∑ₖ₌₁ⁿ ∑ⱼ₌ₖⁿ aⱼ sums over all pairs (k, j) with 1 ≤ k ≤ n and k ≤ j ≤ n. Geometrically, this is the upper-right triangle: {(k,j) : 1 ≤ k ≤ j ≤ n}.'
        },
        {
          title: 'Rewrite by fixing j first',
          content: 'Instead of summing over j for each k, fix j and sum over all k ≤ j. For each j ∈ {1, ..., n}, the values of k range from 1 to j (since we need k ≤ j). This gives ∑ⱼ₌₁ⁿ ∑ₖ₌₁ʲ aⱼ.'
        },
        {
          title: 'Verify the ranges match',
          content: 'Original: for k ∈ {1,...,n}, include j ∈ {k,...,n}. This hits the pair (k,j) once per k and j with k ≤ j. New: for j ∈ {1,...,n}, include k ∈ {1,...,j}. This hits the same pair (k,j) once per j and k with k ≤ j. Same set of pairs, same count.'
        },
        {
          title: 'Simplify using the factor aⱼ',
          content: 'In ∑ⱼ₌₁ⁿ ∑ₖ₌₁ʲ aⱼ, note that aⱼ does not depend on k. So ∑ₖ₌₁ʲ aⱼ = aⱼ · j (summing aⱼ exactly j times). Thus ∑ⱼ₌₁ⁿ ∑ₖ₌₁ʲ aⱼ = ∑ⱼ₌₁ⁿ j · aⱼ. This is often a much simpler form to work with.'
        }
      ],
      answer: 'The region {1 ≤ k ≤ j ≤ n} can be traversed by summing j ∈ {1,...,n} first, then k ∈ {1,...,j} for each j. Since aⱼ is constant in k, ∑ⱼ₌₁ⁿ ∑ₖ₌₁ʲ aⱼ = ∑ⱼ₌₁ⁿ j·aⱼ.'
    },
    {
      id: 's5',
      difficulty: 5,
      statement: 'Use the reciprocal substitution h = 1/n to evaluate lim(n→∞) n sin(1/n) and show it equals 1.',
      steps: [
        {
          title: 'Set up the reciprocal substitution',
          content: 'Let h = 1/n, so n = 1/h. As n → ∞, h → 0⁺. The expression becomes n sin(1/n) = (1/h) sin(h) = sin(h) / h.'
        },
        {
          title: 'Recognize the standard limit',
          content: 'The limit lim(h→0) sin(h) / h is a fundamental limit in calculus, equal to 1. This can be proven using L\'Hôpital\'s rule or geometric arguments about the unit circle.'
        },
        {
          title: 'Apply L\'Hôpital (optional verification)',
          content: 'Both numerator sin(h) and denominator h approach 0 as h → 0⁺, so we have a 0/0 form. By L\'Hôpital: lim(h→0) sin(h) / h = lim(h→0) cos(h) / 1 = cos(0) / 1 = 1.'
        },
        {
          title: 'Conclude the original limit',
          content: 'Since sin(h) / h → 1 as h → 0⁺, and our substitution h = 1/n converts n sin(1/n) into sin(h) / h, we have lim(n→∞) n sin(1/n) = 1.'
        }
      ],
      answer: 'With h = 1/n, the expression n sin(1/n) becomes sin(h) / h where h → 0⁺. The standard limit lim(h→0) sin(h)/h = 1 directly gives the result.'
    }
  ],
  practice: [
    {
      id: 'sp1',
      difficulty: 2,
      statement: 'Apply the exponential-log bridge to find lim(n→∞) (1 + 3/n)ⁿ.',
      steps: [
        {
          question: 'Rewrite (1 + 3/n)ⁿ using the exponential-log bridge.',
          options: [
            '(1 + 3/n)ⁿ = exp(n ln(1 + 3/n))',
            '(1 + 3/n)ⁿ = exp(ln(1 + 3/n) / n)',
            '(1 + 3/n)ⁿ = ln(n(1 + 3/n))',
            '(1 + 3/n)ⁿ = n exp(ln(1 + 3/n))'
          ],
          correct: 0,
          explanations: [
            'Correct! The exponential-log bridge states aⁿ = exp(n ln(a)). Here a = 1 + 3/n, so (1 + 3/n)ⁿ = exp(n ln(1 + 3/n)).',
            'Wrong. The exponent and logarithm are in the wrong positions. It should be n multiplying the logarithm, not dividing it.',
            'Wrong. The ln function produces a number, not an exponential. The structure is exp(something), not ln(something).',
            'Wrong. The factor n should be inside the logarithm (multiplying it), not outside the exponential.'
          ]
        },
        {
          question: 'Using Taylor series, approximate ln(1 + 3/n) for large n.',
          options: [
            'ln(1 + 3/n) ≈ 3/n for large n',
            'ln(1 + 3/n) ≈ 1 + 3/n',
            'ln(1 + 3/n) ≈ 3/n − (3/n)²/2 + ... ≈ 3/n for the leading term',
            'ln(1 + 3/n) ≈ 3 for all n'
          ],
          correct: 0,
          explanations: [
            'Correct! The Taylor series ln(1 + x) = x − x²/2 + x³/3 − ... with x = 3/n gives ln(1 + 3/n) ≈ 3/n for large n (the higher-order terms vanish).',
            'Wrong. ln(1 + 3/n) is not linear in 3/n. The Taylor series starts with 3/n as the leading term, but 1 + 3/n is under the ln, not multiplying it.',
            'Wrong. While this mentions the Taylor series, it\'s incomplete. The point is that for large n, we can approximate using just the leading term 3/n.',
            'Wrong. The argument 3/n goes to 0 as n → ∞, so ln(1 + 3/n) → ln(1) = 0, not 3.'
          ]
        },
        {
          question: 'Evaluate n ln(1 + 3/n) as n → ∞.',
          options: [
            'n ln(1 + 3/n) ≈ n · (3/n) = 3, so the limit is 3',
            'n ln(1 + 3/n) → ∞ since n grows without bound',
            'n ln(1 + 3/n) → 0 since ln(1 + 3/n) → 0',
            'n ln(1 + 3/n) ≈ 3n, so the limit is ∞'
          ],
          correct: 0,
          explanations: [
            'Correct! Using ln(1 + 3/n) ≈ 3/n, we have n ln(1 + 3/n) ≈ n · (3/n) = 3. The factor of n cancels with the 1/n, giving a finite limit of 3.',
            'Wrong. Although n grows, the logarithm shrinks as 3/n → 0, and their product balances to a finite value.',
            'Wrong. While it\'s true that ln(1 + 3/n) → 0, multiplying by n (which grows) can still give a finite limit. The product n · (3/n) = 3.',
            'Wrong. With ln(1 + 3/n) ≈ 3/n, we get n · (3/n) = 3, not 3n. The 1/n in the logarithm cancels with n.'
          ]
        }
      ]
    },
    {
      id: 'sp2',
      difficulty: 2,
      statement: 'Use the substitution εₙ = aₙ − L (centering at the limit) to verify that if aₙ → 2, then aₙ² → 4.',
      steps: [
        {
          question: 'Express aₙ² − 4 in terms of εₙ, where εₙ = aₙ − 2.',
          options: [
            'aₙ² − 4 = (2 + εₙ)² − 4 = 4 + 4εₙ + εₙ² − 4 = 4εₙ + εₙ²',
            'aₙ² − 4 = aₙ · 4 − 4',
            'aₙ² − 4 = εₙ²',
            'aₙ² − 4 = 2εₙ'
          ],
          correct: 0,
          explanations: [
            'Correct! Substitute aₙ = 2 + εₙ: aₙ² = (2 + εₙ)² = 4 + 4εₙ + εₙ². So aₙ² − 4 = 4εₙ + εₙ² = εₙ(4 + εₙ).',
            'Wrong. Multiplying aₙ · 4 gives 4aₙ, not aₙ². The expression should come from squaring 2 + εₙ.',
            'Wrong. This drops the 4εₙ term. Expanding (2 + εₙ)² = 4 + 4εₙ + εₙ², not just εₙ².',
            'Wrong. This ignores the quadratic term εₙ² and misses the factor of 4 in front of εₙ. The correct form is 4εₙ + εₙ².'
          ]
        },
        {
          question: 'Since aₙ → 2, what happens to εₙ as n → ∞?',
          options: [
            'εₙ → 0 (since εₙ = aₙ − 2 and aₙ → 2)',
            'εₙ → 2 (same as aₙ)',
            'εₙ remains constant',
            'εₙ → −2 (opposite sign)'
          ],
          correct: 0,
          explanations: [
            'Correct! By definition, εₙ = aₙ − 2. If aₙ → 2, then aₙ − 2 → 0, so εₙ → 0.',
            'Wrong. εₙ is the deviation (error) from the limit, not the sequence itself. Since aₙ → 2, we have aₙ − 2 → 0.',
            'Wrong. If εₙ were constant, then aₙ = 2 + εₙ would be constant, contradicting aₙ → 2.',
            'Wrong. The sign of εₙ is not opposite to 2. Rather, εₙ measures how far aₙ is from 2, and this distance shrinks to 0.'
          ]
        },
        {
          question: 'Evaluate |aₙ² − 4| = |4εₙ + εₙ²| as n → ∞. Which statement is correct?',
          options: [
            '|4εₙ + εₙ²| ≤ |4εₙ| + |εₙ²| = 4|εₙ| + εₙ² → 0 since εₙ → 0',
            '|4εₙ + εₙ²| = 4 always (constant)',
            '|4εₙ + εₙ²| ≥ 4, so it does not go to zero',
            '|4εₙ + εₙ²| ≈ εₙ, which only goes to zero if εₙ is very small'
          ],
          correct: 0,
          explanations: [
            'Correct! By the triangle inequality, |4εₙ + εₙ²| ≤ 4|εₙ| + |εₙ|² (since |εₙ²| = εₙ² for all real εₙ). Both 4|εₙ| and εₙ² → 0 as εₙ → 0, so their sum → 0. By the squeeze theorem, |aₙ² − 4| → 0.',
            'Wrong. The expression 4εₙ + εₙ² depends on n through εₙ, so it is not constant.',
            'Wrong. When εₙ is small, |4εₙ + εₙ²| can be made arbitrarily small, not bounded below by 4.',
            'Wrong. While it\'s true that |4εₙ + εₙ²| involves εₙ, the leading term is 4εₙ, and εₙ → 0 guarantees |aₙ² − 4| → 0.'
          ]
        }
      ]
    },
    {
      id: 'sp3',
      difficulty: 3,
      statement: 'Use a change of index to simplify the sum ∑ₖ₌₁ⁿ (k+1) · k and evaluate it.',
      steps: [
        {
          question: 'Expand the sum ∑ₖ₌₁ⁿ (k+1) · k to see if you can recognize a pattern or re-index.',
          options: [
            '∑ₖ₌₁ⁿ (k² + k) = ∑ₖ₌₁ⁿ k² + ∑ₖ₌₁ⁿ k',
            '∑ₖ₌₁ⁿ (k+1)! / k!',
            '∑ₖ₌₁ⁿ 2k (the sum of the next k)',
            '∑ₖ₌₁ⁿ k³'
          ],
          correct: 0,
          explanations: [
            'Correct! Expanding (k+1)·k = k² + k, so ∑ₖ₌₁ⁿ (k+1)·k = ∑ₖ₌₁ⁿ k² + ∑ₖ₌₁ⁿ k. This separates into two well-known formulas.',
            'Wrong. (k+1)! / k! = k+1, not (k+1)·k. The original sum is a product, not factorials.',
            'Wrong. (k+1)·k = k² + k, which is much more than 2k. Expanding gives the quadratic k².',
            'Wrong. Squaring (k+1)·k does not yield k³. The product k(k+1) = k² + k, not k³.'
          ]
        },
        {
          question: 'What are the formulas for ∑ₖ₌₁ⁿ k and ∑ₖ₌₁ⁿ k²?',
          options: [
            '∑ₖ₌₁ⁿ k = n(n+1)/2 and ∑ₖ₌₁ⁿ k² = n(n+1)(2n+1)/6',
            '∑ₖ₌₁ⁿ k = n² and ∑ₖ₌₁ⁿ k² = n³',
            '∑ₖ₌₁ⁿ k = 2n and ∑ₖ₌₁ⁿ k² = n(n+1)',
            '∑ₖ₌₁ⁿ k = (n+1)!/2 and ∑ₖ₌₁ⁿ k² = n²(n+1)²'
          ],
          correct: 0,
          explanations: [
            'Correct! These are standard formulas: the sum of the first n natural numbers is n(n+1)/2, and the sum of their squares is n(n+1)(2n+1)/6.',
            'Wrong. For example, ∑ₖ₌₁ⁿ k = 1 + 2 + ... + n ≠ n² (for n=1, LHS=1, RHS=1 so OK, but for n=2, LHS=3, RHS=4). The correct formula is n(n+1)/2.',
            'Wrong. ∑ₖ₌₁ⁿ k = 1 + 2 + 3 + ... + n, which is not 2n. That would be 2 times the average, not the sum.',
            'Wrong. Factorials grow much faster than polynomial sums. The formulas are simple polynomials in n, not factorials.'
          ]
        },
        {
          question: 'Compute ∑ₖ₌₁ⁿ (k+1) · k = ∑ₖ₌₁ⁿ k² + ∑ₖ₌₁ⁿ k.',
          options: [
            'n(n+1)(2n+1)/6 + n(n+1)/2 = n(n+1)[（2n+1)/6 + 1/2] = n(n+1)(2n+4)/6 = n(n+1)(n+2)/3',
            'n(n+1)/2 + n(n+1) = n(n+1)(3/2) = 3n(n+1)/2',
            'n² + n = n(n+1)',
            '2n² + 3n'
          ],
          correct: 0,
          explanations: [
            'Correct! Adding n(n+1)(2n+1)/6 + n(n+1)/2: factor out n(n+1): n(n+1)[(2n+1)/6 + 1/2] = n(n+1)[(2n+1)/6 + 3/6] = n(n+1)(2n+4)/6 = n(n+1) · 2(n+2)/6 = n(n+1)(n+2)/3.',
            'Wrong. This incorrectly adds the two formulas. You must use the actual values: n(n+1)(2n+1)/6 and n(n+1)/2, not mix them up.',
            'Wrong. n(n+1) is just the sum of the linear terms. The sum of the quadratic terms contributes n(n+1)(2n+1)/6, which is much larger.',
            'Wrong. While 2n² + 3n is a rough form of the answer, the correct factorization is n(n+1)(n+2)/3, which is a cleaner expression.'
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
      formal: 'For non-negative reals a, b, we have (a+b)/2 ≥ √(ab). Generally: the arithmetic mean is always ≥ the geometric mean.',
      intuition: 'When you average two numbers, the result is at least as large as their "geometric average." This captures the idea that the sum of two numbers is large enough to bound their product.',
      example: 'For a = 4 and b = 9: (4+9)/2 = 6.5 and √(4·9) = 6, so 6.5 ≥ 6. This shows we can bound 36 from below using the sum 13.'
    },
    {
      term: 'Cauchy-Schwarz Inequality',
      formal: '(∑ₖ₌₁ⁿ aₖbₖ)² ≤ (∑ₖ₌₁ⁿ aₖ²)(∑ₖ₌₁ⁿ bₖ²). The square of an inner product is bounded by the product of squared-sum norms.',
      intuition: 'This is the most powerful tool for controlling mixed sums. When you multiply sequences together and add them up, squaring that gives something controllable by the individual "energy" of each sequence.',
      example: 'For sequences (1,2) and (3,4): (1·3 + 2·4)² = 11² = 121, and (1² + 2²)(3² + 4²) = 5·25 = 125. Indeed 121 ≤ 125.'
    },
    {
      term: 'Young\'s Inequality',
      formal: 'For p, q > 1 with 1/p + 1/q = 1, and a, b ≥ 0: ab ≤ aᵖ/p + bᵍ/q. Generalizes AM-GM and decouples products.',
      intuition: 'When you have a product ab, you can split it into separate pieces aᵖ and bᵍ, weighted by 1/p and 1/q. This is useful when you want to control one factor tightly and let the other vary.',
      example: 'For p = q = 2 (conjugate exponents): ab ≤ a²/2 + b²/2. If a = 3, b = 4: 12 ≤ 9/2 + 16/2 = 12.5. ✓'
    },
    {
      term: 'Bernoulli\'s Inequality',
      formal: 'For n ∈ ℕ and x ≥ −1: (1+x)ⁿ ≥ 1 + nx. The exponential-type expression is always at least linear in x.',
      intuition: 'When you raise (1+x) to a power n, you get something that grows at least linearly with x. This is surprisingly tight and useful for bounding things like (1 + 1/n)ⁿ.',
      example: 'For x = 1/2 and n = 3: (1 + 1/2)³ = (3/2)³ = 27/8 = 3.375, and 1 + 3·(1/2) = 2.5. Indeed 3.375 ≥ 2.5.'
    }
  ],
  explained: [
    {
      id: 'iq1',
      difficulty: 1,
      statement: 'Use AM-GM to prove that a² + b² ≥ 2ab for all a, b ≥ 0.',
      steps: [
        {
          title: 'Apply AM-GM directly',
          content: 'By AM-GM inequality, (a² + b²)/2 ≥ √(a² · b²) = ab (taking square root of both sides of the product).'
        },
        {
          title: 'Multiply both sides by 2',
          content: 'Multiplying both sides of (a² + b²)/2 ≥ ab by 2 gives: a² + b² ≥ 2ab.'
        },
        {
          title: 'Conclude',
          content: 'We have shown a² + b² ≥ 2ab for all a, b ≥ 0. Note: equality holds iff a = b. ∎'
        }
      ],
      answer: 'By AM-GM, (a² + b²)/2 ≥ √(a²b²) = ab. Multiplying by 2: a² + b² ≥ 2ab.'
    },
    {
      id: 'iq2',
      difficulty: 2,
      statement: 'Use Bernoulli\'s inequality to show that (1 + 1/n)ⁿ ≥ 2 for all n ≥ 1.',
      steps: [
        {
          title: 'Identify the setup for Bernoulli',
          content: 'We have (1 + 1/n)ⁿ where x = 1/n ≥ 0 and the exponent is n ∈ ℕ. Bernoulli\'s inequality applies: (1 + 1/n)ⁿ ≥ 1 + n · (1/n).'
        },
        {
          title: 'Simplify the right side',
          content: '1 + n · (1/n) = 1 + 1 = 2.'
        },
        {
          title: 'Combine the bounds',
          content: '(1 + 1/n)ⁿ ≥ 1 + n · (1/n) = 2 for all n ≥ 1.'
        },
        {
          title: 'Verify for a specific value',
          content: 'For n = 1: (1 + 1)¹ = 2 ≥ 2. ✓ For n = 2: (3/2)² = 2.25 ≥ 2. ✓'
        }
      ],
      answer: 'By Bernoulli, (1 + 1/n)ⁿ ≥ 1 + n · (1/n) = 1 + 1 = 2.'
    },
    {
      id: 'iq3',
      difficulty: 3,
      statement: 'Apply Cauchy-Schwarz to prove that (∑ₖ₌₁ⁿ 1/k)·(∑ₖ₌₁ⁿ k) ≥ n².',
      steps: [
        {
          title: 'Set up Cauchy-Schwarz',
          content: 'Let aₖ = 1/√k and bₖ = √k for k = 1, 2, …, n. Then by Cauchy-Schwarz: (∑ₖ₌₁ⁿ aₖbₖ)² ≤ (∑ₖ₌₁ⁿ aₖ²)(∑ₖ₌₁ⁿ bₖ²).'
        },
        {
          title: 'Compute the inner product',
          content: '∑ₖ₌₁ⁿ aₖbₖ = ∑ₖ₌₁ⁿ (1/√k)·(√k) = ∑ₖ₌₁ⁿ 1 = n.'
        },
        {
          title: 'Compute the left and right norms',
          content: '∑ₖ₌₁ⁿ aₖ² = ∑ₖ₌₁ⁿ (1/k) and ∑ₖ₌₁ⁿ bₖ² = ∑ₖ₌₁ⁿ k.'
        },
        {
          title: 'Apply Cauchy-Schwarz and conclude',
          content: 'n² = (∑ₖ₌₁ⁿ 1)² ≤ (∑ₖ₌₁ⁿ 1/k)(∑ₖ₌₁ⁿ k). Therefore (∑ₖ₌₁ⁿ 1/k)(∑ₖ₌₁ⁿ k) ≥ n². ∎'
        }
      ],
      answer: 'By Cauchy-Schwarz with aₖ = 1/√k and bₖ = √k: (∑ₖ₌₁ⁿ 1)² ≤ (∑ₖ₌₁ⁿ 1/k)(∑ₖ₌₁ⁿ k), giving n² ≤ (∑ₖ₌₁ⁿ 1/k)(∑ₖ₌₁ⁿ k).'
    },
    {
      id: 'iq4',
      difficulty: 4,
      statement: 'Use Young\'s inequality (with p = q = 2) to prove that |ab| ≤ a²/2 + b²/2, and apply it to bound a product in a convergence proof.',
      steps: [
        {
          title: 'State Young\'s inequality for p = q = 2',
          content: 'When p = q = 2, we have 1/p + 1/q = 1/2 + 1/2 = 1. Young\'s inequality gives: ab ≤ a²/2 + b²/2 for a, b ≥ 0.'
        },
        {
          title: 'Extend to absolute values',
          content: 'For any real a, b: |ab| = |a|·|b| ≤ |a|²/2 + |b|²/2 = a²/2 + b²/2.'
        },
        {
          title: 'Apply to a convergence context',
          content: 'Suppose xₙ → 0 and yₙ → 0. Then |xₙyₙ| ≤ xₙ²/2 + yₙ²/2 → 0 + 0 = 0, so xₙyₙ → 0. This shows products of vanishing sequences vanish.'
        },
        {
          title: 'Conclude the general principle',
          content: 'Young\'s inequality decouples the product into separate terms, letting us control growth of each variable independently in more complex proofs.'
        }
      ],
      answer: 'Young\'s inequality with p = q = 2: ab ≤ a²/2 + b²/2. Thus |xₙyₙ| ≤ xₙ²/2 + yₙ²/2 → 0 when xₙ, yₙ → 0.'
    },
    {
      id: 'iq5',
      difficulty: 5,
      statement: 'Prove the power mean inequality: √((a² + b²)/2) ≥ (a + b)/2 for a, b ≥ 0, and use it to bound a sequence.',
      steps: [
        {
          title: 'Square both sides to avoid the square root',
          content: 'We want √((a² + b²)/2) ≥ (a + b)/2. Squaring both sides (valid since both are non-negative): (a² + b²)/2 ≥ (a + b)²/4.'
        },
        {
          title: 'Expand and simplify',
          content: 'Multiply both sides by 4: 2(a² + b²) ≥ (a + b)² = a² + 2ab + b². This gives 2a² + 2b² ≥ a² + 2ab + b², or a² + b² ≥ 2ab.'
        },
        {
          title: 'Recognize this as AM-GM',
          content: 'We recover a² + b² ≥ 2ab, which we proved using AM-GM. So the power mean inequality holds, with equality iff a = b.'
        },
        {
          title: 'Apply to bound a sequence',
          content: 'If aₙ, bₙ are bounded sequences with aₙ → L and bₙ → L, then √((aₙ² + bₙ²)/2) ≤ max{|aₙ|, |bₙ|} · √2 is controlled by the individual bounds, and √((L² + L²)/2) = L√2 is the limit. This shows how the power mean helps in convergence arguments.'
        }
      ],
      answer: 'By squaring: (a² + b²)/2 ≥ (a+b)²/4 ⇔ a² + b² ≥ 2ab (AM-GM). For sequences, this bounds √((aₙ² + bₙ²)/2) by controlling each term separately.'
    }
  ],
  practice: [
    {
      id: 'iqp1',
      difficulty: 1,
      statement: 'For a = 2 and b = 8, use AM-GM to establish the bound (a + b)/2 ≥ √(ab). What is the relationship between the two sides?',
      steps: [
        {
          question: 'Calculate (a + b)/2 for a = 2 and b = 8.',
          options: ['5', '10', '6', '8'],
          correct: 0,
          explanations: [
            'Correct! (2 + 8)/2 = 10/2 = 5.',
            'You calculated a + b = 10, but forgot to divide by 2.',
            'This is √(ab). We need (a+b)/2 first.',
            'This is one of the original values, not the average.'
          ]
        },
        {
          question: 'Calculate √(ab) for a = 2 and b = 8.',
          options: ['4', '5', '6.4', '10'],
          correct: 0,
          explanations: [
            'Correct! √(2·8) = √16 = 4.',
            'This is (a+b)/2. We need √(ab).',
            'This is between 4 and 5 but not exact.',
            'This is a + b. We need √(ab).'
          ]
        },
        {
          question: 'Which of the following correctly states the AM-GM relationship for a = 2, b = 8?',
          options: ['5 ≥ 4', '4 ≥ 5', '5 = 4', 'Neither is ≥ the other'],
          correct: 0,
          explanations: [
            'Correct! 5 ≥ 4, so (a+b)/2 ≥ √(ab). AM-GM holds.',
            'This is backwards. The arithmetic mean should be larger.',
            'AM-GM is an inequality, not an equality (unless a = b).',
            'AM-GM states one must be ≥ the other; here (a+b)/2 ≥ √(ab).'
          ]
        }
      ]
    },
    {
      id: 'iqp2',
      difficulty: 2,
      statement: 'Apply Bernoulli\'s inequality (1 + x)ⁿ ≥ 1 + nx to estimate (1.1)⁵. Which statement is correct?',
      steps: [
        {
          question: 'In Bernoulli\'s inequality for (1.1)⁵, what are x and n?',
          options: ['x = 0.1, n = 5', 'x = 1.1, n = 5', 'x = 5, n = 0.1', 'x = 0.1, n = 1.1'],
          correct: 0,
          explanations: [
            'Correct! (1.1)⁵ = (1 + 0.1)⁵, so x = 0.1 and n = 5.',
            'x should be 0.1 (the number added to 1), not 1.1.',
            'You reversed the roles. The exponent is n = 5.',
            'These are not set correctly. Bernoulli has (1+x)ⁿ form.'
          ]
        },
        {
          question: 'By Bernoulli, (1.1)⁵ ≥ 1 + 5(0.1) = ?',
          options: ['1.5', '2.0', '1.6', '1.05'],
          correct: 0,
          explanations: [
            'Correct! 1 + 5(0.1) = 1 + 0.5 = 1.5.',
            'Close, but 5(0.1) = 0.5, not 1. So 1 + 0.5 = 1.5.',
            'You calculated 1 + 0.6 instead of 1 + 0.5.',
            'This is 1 + 0.05, but the coefficient is 5, not 0.5.'
          ]
        },
        {
          question: 'Is the Bernoulli bound (1.1)⁵ ≥ 1.5 tight (close to the true value)?',
          options: ['No, the true value (≈1.61) is significantly larger', 'Yes, they are equal', 'No, the true value is smaller', 'Cannot be determined'],
          correct: 0,
          explanations: [
            'Correct! The actual value is (1.1)⁵ ≈ 1.61051, which is > 1.5. Bernoulli gives a lower bound but not a tight one.',
            'Equality only holds when x = 0 (or when n = 1). They are not equal here.',
            'Bernoulli guarantees a lower bound, so the true value must be ≥ 1.5.',
            'We can determine this: Bernoulli gives a provable bound, and we know (1.1)⁵ ≈ 1.61.'
          ]
        }
      ]
    },
    {
      id: 'iqp3',
      difficulty: 3,
      statement: 'Use Cauchy-Schwarz inequality to bound ∑ₖ₌₁³ 1·k. Set aₖ = 1 and bₖ = k.',
      steps: [
        {
          question: 'By Cauchy-Schwarz, (∑ₖ₌₁³ 1·k)² ≤ (∑ₖ₌₁³ 1²)(∑ₖ₌₁³ k²). Calculate ∑ₖ₌₁³ 1·k.',
          options: ['6', '14', '36', '9'],
          correct: 0,
          explanations: [
            'Correct! ∑ₖ₌₁³ 1·k = 1·1 + 2·1 + 3·1 = 1 + 2 + 3 = 6.',
            'This is (∑ₖ₌₁³ k²) = 1 + 4 + 9 = 14, not ∑ₖ₌₁³ k.',
            'This is (∑ₖ₌₁³ k)² = 6² = 36. But we need ∑ₖ₌₁³ 1·k first.',
            'This is ∑ₖ₌₁³ 1² = 3. We need the sum 1 + 2 + 3.'
          ]
        },
        {
          question: 'Calculate ∑ₖ₌₁³ 1² and ∑ₖ₌₁³ k².',
          options: ['3 and 14', '3 and 9', '1 and 6', '3 and 36'],
          correct: 0,
          explanations: [
            'Correct! ∑ₖ₌₁³ 1² = 1 + 1 + 1 = 3, and ∑ₖ₌₁³ k² = 1 + 4 + 9 = 14.',
            'First sum is correct, but ∑ₖ₌₁³ k² = 1 + 4 + 9 = 14, not 9.',
            'These are not the squared sums. ∑ₖ₌₁³ 1² = 3 and ∑ₖ₌₁³ k² = 14.',
            'The first is right, but the second is 14, not 36 (which is 6²).'
          ]
        },
        {
          question: 'By Cauchy-Schwarz, 6² ≤ 3·14. Verify: does 36 ≤ 42 hold?',
          options: ['Yes, 36 ≤ 42 is true', 'No, 36 > 42', 'No, 36 = 42', 'Cannot compare'],
          correct: 0,
          explanations: [
            'Correct! 36 ≤ 42 is true, so Cauchy-Schwarz is satisfied.',
            'Actually 36 < 42, so the inequality holds.',
            'They are not equal: 36 ≠ 42. But the inequality ≤ is satisfied.',
            'We can compare: both are numbers. 36 is indeed ≤ 42.'
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
      term: 'The min{δ₁, δ₂} Pattern',
      formal: 'When a proof requires two independent conditions to hold simultaneously (e.g., δ₁ for one inequality and δ₂ for another), choose δ = min{δ₁, δ₂, …, δₖ}. This ensures all k conditions are satisfied at once.',
      intuition: 'If you need δ to be "small enough" in two different ways, take the smaller threshold. This guarantees that both conditions (which each have their own critical threshold) are both satisfied.',
      example: 'To prove |f(x) − 2| < ε, you might need |x − 1| < ε/2 and separately |x − 1| < 1. Take δ = min{ε/2, 1}, so both are satisfied simultaneously.'
    },
    {
      term: 'Working Backwards from ε',
      formal: 'Start with the desired conclusion |f(x) − L| < ε, manipulate algebraically to extract what δ must be, then write the proof forwards using that δ. The backwards phase is scratch work; the forwards phase is the polished proof.',
      intuition: 'Instead of guessing δ out of thin air, derive it by asking "What constraint on x gives |f(x) − L| < ε?" This guides your choice and guarantees the proof will work.',
      example: 'Want |3x + 1 − 4| < ε. Then |3x − 3| < ε, so |3(x − 1)| < ε, thus |x − 1| < ε/3. Therefore δ = ε/3 is the right choice.'
    },
    {
      term: 'The "Let M = max{...}" Pattern',
      formal: 'When bounding over finitely many items (e.g., |f(x₁)|, |f(x₂)|, …, |f(xₙ)|), take M = max{|f(x₁)|, …, |f(xₙ)|}. For behavior beyond the finite set, use convergence or continuity on that remaining region.',
      intuition: 'Finite sets are easy to control: just take the worst case. Infinite behavior is handled separately by convergence or uniform properties. This split simplifies the argument.',
      example: 'The first 100 terms of a sequence might each be as large as 50. So |a₁|, …, |a₁₀₀| ≤ 100. For n > 100, the sequence converges to 0, so |aₙ| < ε for n ≥ N. Finite part is bounded by max; tail is controlled by convergence.'
    },
    {
      term: 'Proof Architecture',
      formal: 'For ε-δ continuity: (1) Let ε > 0 (given). (2) Define δ in terms of ε (using backwards work). (3) Show that |x − a| < δ ⇒ |f(x) − f(a)| < ε. For sequence limits: (1) Let ε > 0. (2) Use given convergences to find N such that n ≥ N ensures the bound. (3) For n ≥ N, chain the inequalities to reach the conclusion.',
      intuition: 'All proofs follow a rigid template: set up ε, find the threshold (δ or N), then verify the conclusion. Mastering the template lets you quickly assemble any ε-δ or convergence proof.',
      example: 'Template: "Let ε > 0. Set δ = ε/3. If |x − 1| < δ, then |3x + 1 − 4| = |3(x−1)| = 3|x−1| < 3δ = ε. Thus f is continuous at 1." This is the forward-facing polished version.'
    }
  ],
  explained: [
    {
      id: 'asm1',
      difficulty: 1,
      statement: 'Complete an ε-δ proof that f(x) = 3x + 1 is continuous at x = 1. Show the backwards work first, then write the forwards proof.',
      steps: [
        {
          title: 'Backwards work: determine δ',
          content: 'We want |f(x) − f(1)| < ε. Compute: |3x + 1 − (3·1 + 1)| = |3x + 1 − 4| = |3(x − 1)| = 3|x − 1|. For this to be < ε, we need 3|x − 1| < ε, so |x − 1| < ε/3. Thus δ = ε/3.'
        },
        {
          title: 'Forward proof setup',
          content: 'Let ε > 0. Set δ = ε/3. We will show that |x − 1| < δ implies |f(x) − f(1)| < ε.'
        },
        {
          title: 'Chain the inequalities forward',
          content: 'Assume |x − 1| < δ = ε/3. Then |f(x) − f(1)| = |3x + 1 − 4| = |3(x − 1)| = 3|x − 1| < 3·(ε/3) = ε.'
        },
        {
          title: 'Conclusion',
          content: 'Thus |f(x) − f(1)| < ε whenever |x − 1| < δ. By definition, f is continuous at x = 1. ∎'
        }
      ],
      answer: 'Backwards: |3(x−1)| < ε ⇒ |x−1| < ε/3, so δ = ε/3. Forwards: Let ε > 0, set δ = ε/3. If |x−1| < δ, then |f(x)−f(1)| = 3|x−1| < 3·(ε/3) = ε.'
    },
    {
      id: 'asm2',
      difficulty: 2,
      statement: 'Prove that f(x) = x² is continuous at x = a by combining the δ choice with bounding |x + a|.',
      steps: [
        {
          title: 'Backwards work: factor and bound',
          content: 'We want |x² − a²| < ε. Factor: |x² − a²| = |x − a||x + a|. For small x near a, we can bound |x + a| ≤ |x − a| + 2|a|. To make this simple, assume |x − a| < 1, so |x + a| ≤ 1 + 2|a| =: B.'
        },
        {
          title: 'Derive δ from ε',
          content: 'We need |x − a||x + a| < ε. Given |x + a| ≤ B, we need |x − a| < ε/B. Set δ = min{1, ε/B} to ensure both |x − a| < 1 and |x − a| < ε/B hold.'
        },
        {
          title: 'Forward proof with δ = min{1, ε/B}',
          content: 'Let ε > 0. Let B = 2|a| + 1. Set δ = min{1, ε/B}. If |x − a| < δ, then |x − a| < 1 and |x − a| < ε/B. Also |x + a| = |(x − a) + 2a| ≤ |x − a| + 2|a| < 1 + 2|a| = B.'
        },
        {
          title: 'Conclude the bound',
          content: '|f(x) − f(a)| = |x² − a²| = |x − a||x + a| < (ε/B)·B = ε. Thus f is continuous at a. ∎'
        }
      ],
      answer: 'Let B = 2|a| + 1. Set δ = min{1, ε/B}. If |x−a| < δ, then |x−a| < 1 so |x+a| < B, thus |x²−a²| = |x−a||x+a| < (ε/B)·B = ε.'
    },
    {
      id: 'asm3',
      difficulty: 3,
      statement: 'Prove that if fₙ → f uniformly and each fₙ is continuous at x = a, then f is continuous at x = a. Use the ε/3 trick to split the bound into three parts.',
      steps: [
        {
          title: 'Set up the three-part bound',
          content: 'We want to show |f(x) − f(a)| is small. Write |f(x) − f(a)| ≤ |f(x) − fₙ(x)| + |fₙ(x) − fₙ(a)| + |fₙ(a) − f(a)|. We will make each piece < ε/3.'
        },
        {
          title: 'Use uniform convergence for the outer pieces',
          content: 'Since fₙ → f uniformly, for ε/3, there exists N such that for all n ≥ N and all x ∈ ℝ: |fₙ(x) − f(x)| < ε/3 and |fₙ(a) − f(a)| < ε/3. Fix such an n ≥ N.'
        },
        {
          title: 'Use continuity of fₙ for the middle piece',
          content: 'For this fixed fₙ, since it is continuous at a, there exists δ > 0 such that |x − a| < δ ⇒ |fₙ(x) − fₙ(a)| < ε/3.'
        },
        {
          title: 'Combine all three bounds',
          content: 'If |x − a| < δ, then |f(x) − f(a)| ≤ |f(x) − fₙ(x)| + |fₙ(x) − fₙ(a)| + |fₙ(a) − f(a)| < ε/3 + ε/3 + ε/3 = ε. Thus f is continuous at a. ∎'
        }
      ],
      answer: 'Use fₙ → f uniformly to make |f(x)−fₙ(x)| and |fₙ(a)−f(a)| each < ε/3. Use continuity of fₙ to make |fₙ(x)−fₙ(a)| < ε/3. Sum: |f(x)−f(a)| < ε.'
    },
    {
      id: 'asm4',
      difficulty: 4,
      statement: 'Prove the algebra of limits: if aₙ → L and bₙ → M ≠ 0, then aₙ/bₙ → L/M. Combine bounding 1/bₙ, add-subtract technique, M-bound, and ε-budgeting.',
      steps: [
        {
          title: 'Step 1: Stabilize bₙ away from zero',
          content: 'Since bₙ → M ≠ 0, for ε = |M|/2, there exists N₁ such that n ≥ N₁ ⇒ |bₙ − M| < |M|/2. By triangle inequality, |bₙ| ≥ |M| − |bₙ − M| > |M|/2. Thus 1/|bₙ| < 2/|M| for large n.'
        },
        {
          title: 'Step 2: Use the add-subtract technique',
          content: 'Write aₙ/bₙ − L/M = (aₙM − LbₙM)/(bₙM) = (aₙM − LM + LM − LbₙM)/(bₙM) = [M(aₙ−L) − L(bₙ−M)]/(bₙM).'
        },
        {
          title: 'Step 3: Bound the numerator by ε-budgeting',
          content: 'We want |aₙ/bₙ − L/M| small. Given ε > 0, use aₙ → L and bₙ → M: choose N₂ such that n ≥ N₂ ⇒ |aₙ − L| < ε/(2(|M|+1)) and |bₙ − M| < ε|M|/(2(|L|+1)). This ensures |M(aₙ−L)| < ε/2 and |L(bₙ−M)| < ε/2.'
        },
        {
          title: 'Step 4: Combine and conclude',
          content: 'For n ≥ max{N₁, N₂}: |aₙ/bₙ − L/M| = |M(aₙ−L) − L(bₙ−M)|/(|bₙ||M|) < (ε/2 + ε/2) · (2/|M|) · (1/|M|) < ε·2/(|M|²). Adjust ε-budgeting in earlier steps to ensure final bound < ε. Thus aₙ/bₙ → L/M. ∎'
        }
      ],
      answer: 'Stabilize bₙ: |bₙ| > |M|/2 for large n, so 1/bₙ is bounded. Use add-subtract: aₙ/bₙ − L/M = [M(aₙ−L) − L(bₙ−M)]/(bₙM). Budget ε/2 each to aₙ→L and bₙ→M, ensuring the sum is < ε·(2/|M|²), which approaches 0.'
    },
    {
      id: 'asm5',
      difficulty: 5,
      statement: 'Prove that a continuous function on [a,b] is uniformly continuous, using compactness (finite subcover) and showing how the min{δ₁,…,δₙ} pattern combines all local δ\'s into a global one.',
      steps: [
        {
          title: 'Step 1: Use local continuity to find local δ\'s',
          content: 'Let f be continuous on [a,b] and ε > 0. At each point x ∈ [a,b], continuity gives a δ(x) > 0 such that |t − x| < δ(x) ⇒ |f(t) − f(x)| < ε/2. The open balls Bδ(x)/2(x) cover [a,b].'
        },
        {
          title: 'Step 2: Apply compactness to extract a finite subcover',
          content: 'Since [a,b] is compact, there exist finitely many points x₁, …, xₙ ∈ [a,b] such that [a,b] ⊆ ∪ᵢ₌₁ⁿ Bδ(xᵢ)/2(xᵢ). Let δ = min{δ(x₁)/2, …, δ(xₙ)/2} > 0.'
        },
        {
          title: 'Step 3: Show uniform continuity via the min pattern',
          content: 'Let s, t ∈ [a,b] with |s − t| < δ. Then s lies in some ball Bδ(xᵢ)/2(xᵢ), so |s − xᵢ| < δ(xᵢ)/2. Since |s − t| < δ ≤ δ(xᵢ)/2, we have |t − xᵢ| ≤ |t − s| + |s − xᵢ| < δ(xᵢ)/2 + δ(xᵢ)/2 = δ(xᵢ). Thus |f(s) − f(xᵢ)| < ε/2 and |f(t) − f(xᵢ)| < ε/2 by local continuity.'
        },
        {
          title: 'Step 4: Conclude uniform continuity',
          content: '|f(s) − f(t)| ≤ |f(s) − f(xᵢ)| + |f(xᵢ) − f(t)| < ε/2 + ε/2 = ε. We found a single δ that works for all pairs (s,t) with |s−t| < δ, proving uniform continuity. ∎'
        }
      ],
      answer: 'Continuity gives local δ(x) at each x. Compactness yields a finite subcover with finitely many δ(x₁),…,δ(xₙ). Set δ = min{δ(xᵢ)/2}. If |s−t| < δ, both s and t satisfy |·−xᵢ| < δ(xᵢ), so |f(s)−f(t)| < ε/2 + ε/2 = ε.'
    }
  ],
  practice: [
    {
      id: 'asmp1',
      difficulty: 1,
      statement: 'For f(x) = x², prove continuity at x = 2 using δ = min{1, ε/5}. What is the purpose of the min pattern here?',
      steps: [
        {
          question: 'Why do we use δ = min{1, ε/5} instead of just δ = ε/5?',
          options: [
            'We need |x−2| < 1 to bound |x+2| ≤ 5, ensuring |x²−4| = |x−2||x+2| < ε',
            'δ = ε/5 alone would make the proof incomplete',
            'The min pattern is always required in every proof',
            'We cannot use ε/5 because it might be too large'
          ],
          correct: 0,
          explanations: [
            'Correct! The constraint |x−2| < 1 gives |x+2| < 5. Then |x²−4| = |x−2||x+2| < (ε/5)·5 = ε.',
            'δ = ε/5 does work algebraically, but we need to first bound the other factor |x+2|, which requires controlling how close x is to 2.',
            'The min pattern is used when multiple constraints must hold simultaneously. Here we need both |x−2| < 1 (for bounding) and |x−2| < ε/5 (for the ε condition).',
            'Both ε/5 and 1 are positive; we take the smaller to satisfy both constraints at once.'
          ]
        },
        {
          question: 'If ε = 0.1, what is δ = min{1, ε/5}?',
          options: ['δ = 0.02', 'δ = 1', 'δ = 0.1', 'δ = 0.05'],
          correct: 0,
          explanations: [
            'Correct! ε/5 = 0.1/5 = 0.02. Since 0.02 < 1, min{1, 0.02} = 0.02.',
            'ε/5 = 0.02, which is less than 1, so we take the min (the smaller value).',
            'That is ε itself, not ε/5.',
            'That is ε/2, not ε/5. ε/5 = 0.02.'
          ]
        },
        {
          question: 'Using δ = 0.02, verify: if |x−2| < 0.02, is |x²−4| < 0.1?',
          options: [
            'Yes, |x−2||x+2| < 0.02·5 = 0.1',
            'No, the bound is not tight enough',
            'Yes, but only by coincidence',
            'Cannot determine without knowing x'
          ],
          correct: 0,
          explanations: [
            'Correct! If |x−2| < 0.02 and we established |x+2| ≤ 5, then |x²−4| = |x−2||x+2| < 0.02·5 = 0.1 = ε.',
            'The bound is tight enough: 0.02·5 = 0.1, which equals ε.',
            'It is not a coincidence; the min pattern ensures both conditions work together exactly.',
            'We know |x+2| ≤ 5 from |x−2| < 1, and since 0.02 < 1, this bound applies.'
          ]
        }
      ]
    },
    {
      id: 'asmp2',
      difficulty: 2,
      statement: 'In the proof that fₙ → f uniformly and each fₙ is continuous ⇒ f is continuous, why do we use ε/3 (not ε/2)?',
      steps: [
        {
          question: 'How many pieces appear in |f(x) − f(a)| ≤ |f(x) − fₙ(x)| + |fₙ(x) − fₙ(a)| + |fₙ(a) − f(a)|?',
          options: ['3 pieces', '2 pieces', '4 pieces', '1 piece'],
          correct: 0,
          explanations: [
            'Correct! The three terms are: |f(x)−fₙ(x)|, |fₙ(x)−fₙ(a)|, and |fₙ(a)−f(a)|.',
            'This is the number of terms after "sandwich." The middle term |fₙ(x)−fₙ(a)| is the third.',
            'We have exactly three pieces: the uniform convergence errors at x and a, plus the continuity error at a.',
            'The full expression has three absolute-value terms, so three pieces.'
          ]
        },
        {
          question: 'If we set each piece < ε/3, their sum is < ?',
          options: ['ε', 'ε/3', '3ε', 'ε/2'],
          correct: 0,
          explanations: [
            'Correct! ε/3 + ε/3 + ε/3 = 3·(ε/3) = ε.',
            'If each is ε/3, the sum of three pieces is 3·(ε/3) = ε, not ε/3.',
            'If the sum were 3ε, we would have set each piece to ε, not ε/3.',
            'If the sum were ε/2, we would need each piece to be ε/6 (since 3·(ε/6) = ε/2).'
          ]
        },
        {
          question: 'What if we had 4 pieces to bound? What fraction should each be?',
          options: ['ε/4', 'ε/3', 'ε/2', 'ε/5'],
          correct: 0,
          explanations: [
            'Correct! With 4 pieces, each < ε/4 ensures the sum < 4·(ε/4) = ε.',
            'ε/3 is for 3 pieces. With 4 pieces, we divide ε into 4 parts.',
            'ε/2 is not the right split. We need 4·(?) = ε, so ? = ε/4.',
            'ε/5 is for 5 pieces, not 4. With k pieces, set each < ε/k.'
          ]
        }
      ]
    },
    {
      id: 'asmp3',
      difficulty: 3,
      statement: 'Complete an assembly proof: show that the sequence aₙ = (1 + 1/n)ⁿ converges, using Bernoulli\'s inequality and the "Let M = max{...}" pattern for the first 10 terms.',
      steps: [
        {
          question: 'By Bernoulli, (1 + 1/n)ⁿ ≥ 1 + n·(1/n) = 2 for all n ≥ 1. So aₙ is bounded below by ?',
          options: ['2', '1', 'n', '1 + 1/n'],
          correct: 0,
          explanations: [
            'Correct! Bernoulli gives (1+1/n)ⁿ ≥ 2, so every term is ≥ 2.',
            'By Bernoulli, the bound is 1 + 1 = 2, not just 1.',
            'n is not a lower bound; aₙ does not grow with n.',
            '1 + 1/n approaches 1 from above, much smaller than the actual terms.'
          ]
        },
        {
          question: 'For the finite terms a₁, a₂, …, a₁₀, let M = max{a₁, …, a₁₀}. Is M ≥ aₙ for n > 10?',
          options: [
            'No, we must show separately that aₙ is bounded for n > 10 by convergence',
            'Yes, M bounds all aₙ for all n',
            'Only if M is defined differently',
            'Cannot determine without computing M'
          ],
          correct: 0,
          explanations: [
            'Correct! M controls the first 10 terms. For n > 10, we use a separate argument (e.g., aₙ is increasing and bounded above, so it converges).',
            'M only bounds the finite set {a₁,…,a₁₀}. The tail n > 10 needs its own analysis.',
            'The definition of M as the max of the finite set {a₁,…,a₁₀} is standard. The tail requires a different bound.',
            'You can compute M ≈ a₁₀ ≈ 2.594, but the point is that the finite set is separate from the tail.'
          ]
        },
        {
          question: 'To complete the proof that aₙ → L for some L, we would need to show the tail n > 10 is ?',
          options: [
            'Increasing and bounded above (by some calculation, e.g., using the binomial expansion)',
            'Decreasing and bounded below',
            'Equal to M',
            'Divergent'
          ],
          correct: 0,
          explanations: [
            'Correct! The tail {a₁₁, a₁₂, …} is increasing (by algebraic manipulation) and bounded above by 3 (by the binomial theorem). Monotone bounded theorem applies.',
            'The sequence is actually increasing, not decreasing.',
            'M bounds the first 10 terms, but the tail continues growing (towards e).',
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
  const mathS = { fontFamily: T.fontMono, fontSize: 14, lineHeight: 1.7, background: T.cardAlt, padding: '12px 16px', borderRadius: 8, marginBottom: 12, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
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
            <div style={defTermS}>{d.term}</div>
            <div style={Object.assign({}, labelS, { color: T.textMuted, marginTop: 16 })}>FORMAL</div>
            <div style={mathS}>{d.formal}</div>
            <div style={Object.assign({}, labelS, { color: T.textMuted })}>INTUITION</div>
            <div style={bodyS}>{d.intuition}</div>
            <div style={Object.assign({}, labelS, { color: T.textMuted })}>EXAMPLE</div>
            <div style={mathS}>{d.example}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button style={defIdx > 0 ? btnOutS : btnDimS} onClick={prevDef} disabled={defIdx === 0}>{'\u2190 Prev'}</button>
              <button style={btnS} onClick={nextDef}>{defIdx < ch.defs.length - 1 ? 'Next \u2192' : 'Start Problems \u2192'}</button>
            </div>
          </div>
        );
      })()}

      {section === 'explained' && items[probIdx] && (() => {
        const prob = items[probIdx];
        return (
          <div style={cardS}>
            <div style={Object.assign({}, labelS, { color: T.green })}>EXPLAINED {probIdx + 1} OF {items.length} {' \u00b7 Difficulty ' + '\u2605'.repeat(prob.difficulty) + '\u2606'.repeat(5 - prob.difficulty)}</div>
            <div style={{ fontFamily: T.font, fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 16, lineHeight: 1.5 }}>{prob.statement}</div>
            {prob.steps.map((step, i) => (
              <div key={i} style={{ opacity: i <= stepIdx ? 1 : 0.3, marginBottom: 12, transition: 'opacity .3s' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.accent, marginBottom: 4 }}>Step {i + 1}: {step.title}</div>
                {i <= stepIdx && <div style={mathS}>{step.content}</div>}
              </div>
            ))}
            {stepIdx < prob.steps.length - 1 && (
              <button style={btnS} onClick={nextStep}>Reveal Next Step \u2192</button>
            )}
            {stepIdx === prob.steps.length - 1 && (
              <div>
                <div style={Object.assign({}, cardS, { background: T.accentDim, border: '1px solid ' + T.accent, marginTop: 12 })}>
                  <div style={Object.assign({}, labelS, { color: T.accent })}>ANSWER</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 14, color: T.accent }}>{prob.answer}</div>
                </div>
                <button style={Object.assign({}, btnS, { marginTop: 8 })} onClick={nextProb}>
                  {probIdx < items.length - 1 ? 'Next Problem \u2192' : 'Start Practice \u2192'}
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
            <div style={Object.assign({}, labelS, { color: T.blue })}>PRACTICE {probIdx + 1} OF {items.length} \u00b7 STEP {stepIdx + 1} OF {prob.steps.length}</div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 8, lineHeight: 1.5 }}>{prob.statement}</div>
            <div style={{ fontSize: 15, color: T.text, marginBottom: 16, lineHeight: 1.5 }}>{step.question}</div>
            {step.options.map((opt, i) => (
              <div key={i} style={optionS(selected === i, i === step.correct, showExplanation)}
                onClick={() => selectAnswer(i)}>
                <span style={{ fontWeight: 600, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>
                {opt}
                {showExplanation && selected === i && (
                  <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5, opacity: 0.9 }}>{step.explanations[i]}</div>
                )}
              </div>
            ))}
            {showExplanation && selected !== step.correct && (
              <div style={Object.assign({}, mathS, { background: T.greenDim, border: '1px solid ' + T.green, marginTop: 8 })}>
                <span style={{ fontWeight: 600, color: T.green }}>Correct answer: {String.fromCharCode(65 + step.correct)}.</span> {step.explanations[step.correct]}
              </div>
            )}
            {showExplanation && (
              <button style={Object.assign({}, btnS, { marginTop: 12 })} onClick={() => {
                if (stepIdx < prob.steps.length - 1) { nextStep(); }
                else nextProb();
              }}>
                {stepIdx < prob.steps.length - 1 ? 'Next Question \u2192' : probIdx < items.length - 1 ? 'Next Problem \u2192' : chapter < CHAPTERS.length - 1 ? 'Next Chapter \u2192' : 'Course Complete!'}
              </button>
            )}
          </div>
        );
      })()}

      <div style={{ textAlign: 'center', padding: '20px 0 40px', fontSize: 12, color: T.textMuted }}>
        Algebraic Tricks for Real Analysis \u00b7 Chapter {ch.num} of {CHAPTERS.length}
      </div>
    </div>
  );
}
