/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<iron-iconset-svg name="my-icons" size="24">
  <svg>
    <defs>
      <g id="arrow-back">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
      </g>
      <g id="menu">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
      </g>
      <g id="chevron-right">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
      </g>
      <g id="close">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </g>
       <path stroke="null" stroke-width="0" id="search" d="m15.055173,17.319496c-1.533791,1.096585 -3.410487,1.741586 -5.437322,1.741586c-5.180526,0 -9.380173,-4.213763 -9.380173,-9.411702c0,-5.197939 4.199647,-9.411702 9.380173,-9.411702c5.180526,0 9.380173,4.213763 9.380173,9.411702c0,2.033647 -0.64284,3.916652 -1.735751,5.455598l6.163105,6.18382c0.607173,0.609214 0.602108,1.583989 -0.000221,2.188342l-0.025867,0.025954c-0.600795,0.602814 -1.578804,0.604453 -2.181012,0.000221l-6.163105,-6.18382l0,0zm-5.437322,-0.472932c3.961578,0 7.173073,-3.22229 7.173073,-7.197184c0,-3.974894 -3.211495,-7.197184 -7.173073,-7.197184c-3.961578,0 -7.173073,3.22229 -7.173073,7.197184c0,3.974894 3.211495,7.197184 7.173073,7.197184l0,0z"/>
       </defs>
  </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer.content);
