---
id: extract
title: Extract
sidebar_label: Extract
---

Extract let you select an arbitrary portion of the input image specifying the coordinates and the size of the extraction.

The parameters are, in the order, `x`, `y`, `width` and `height`.

**Original**
<a href="assets/example/cakes_original.jpeg" target="_blank"><img src="assets/example/cakes_original.jpeg" /></a>

<pre><code class="hljs css html">http://caravaggio.host/<strong>ex_95_35_100_100</strong>/https://goo.gl/wcnQSx</code></pre>

<a href="assets/example/cakes_extracted.jpeg" target="_blank"><img src="assets/example/cakes_extracted.jpeg" /></a>

Both dimension and coordinates can be specified as pixel or percentage. See [sizes](resize.html#sizes) documentation.