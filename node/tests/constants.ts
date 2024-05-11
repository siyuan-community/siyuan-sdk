/**
 * Copyright (C) 2023 SiYuan Community
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default {
    /* pandoc 工作目录 */
    PANDOC_CONVERT_DIR_PATH: "/temp/convert/pandoc", // pandoc 转换目录

    BROADCAST_CHANNEL_NAME: "channel-test", // 测试用广播通道名称
    BROADCAST_CHANNEL_NAME_MESSAGE: "channel-test", // 消息测试用广播通道名称
    /* 测试用文件内容 */
    TEST_FILE_CONTENT: `<html>
    <body>
        <h1 id="20230628203216-ppj7cyn" updated="20230628203216">一级标题</h1>
        <h2 id="20230628203216-rnjatsj" updated="20230628203216">二级标题</h2>
        <h3 id="20230628203216-gz2zqwo" updated="20230628203216">三级标题</h3>
        <h4 id="20230628203216-t92fu8e" updated="20230628203216">四级标题</h4>
        <h5 id="20230628203216-qh17pne" updated="20230628203216">五级标题</h5>
        <h6 id="20230628203216-47tvuu1" updated="20230628203216">六级标题</h6>
        <ul id="20230628203216-bn9sghu" updated="20230628203216">
        <li id="20230628203216-spwwbdn" updated="20230628203216">
        <p id="20230628203216-9skvixj" updated="20230628203216">无序列表</p>
        </li>
        </ul>
        <ol id="20230628203216-t2mum50" updated="20230628203216">
        <li id="20230628203216-k9ktt1o" updated="20230628203216">
        <p id="20230628203216-rc89rit" updated="20230628203216">有序列表</p>
        </li>
        </ol>
        <ul id="20230628203216-mpg1uls" updated="20230628203216">
        <li id="20230628203216-zhw17oq" updated="20230628203216" class="protyle-task"><input disabled="" type="checkbox">
        <p id="20230628203216-e0sr6le" updated="20230628203216">任务列表</p>
        </li>
        </ul>
        <blockquote id="20230628203216-q3uimqs" updated="20230628203216">
        <p id="20230628203216-efik1kr" updated="20230628203216">引述</p>
        </blockquote>
        <hr>
        <table id="20230628203216-cca93c9" updated="20230628203216">
        <thead>
        <tr>
        <th>表格</th>
        <th>表头</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>单元格 1-1</td>
        <td>单元格 1-2</td>
        </tr>
        <tr>
        <td>单元格 2-1</td>
        <td>单元格 2-2</td>
        </tr>
        </tbody>
        </table>
        <pre class="code-block" data-language="plaintext"><code class="hljs" data-render="true" style="white-space: pre; word-break: initial; font-variant-ligatures: normal;">代码块
        </code></pre>
        <hr>
        <p id="20230628203216-uvurfgv" updated="20230628203216"><a href="https://ld246.com">超级链接</a></p>
        <p id="20230628203216-0tpetx9" updated="20230628203216"><span data-type="strong">粗体</span></p>
        <p id="20230628203216-h1z1y96" updated="20230628203216"><span data-type="em">斜体</span></p>
        <p id="20230628203216-g5yqgqv" updated="20230628203216"><span data-type="u">下划线</span></p>
        <p id="20230628203216-nbepb0k" updated="20230628203216"><span data-type="s">删除线</span></p>
        <p id="20230628203216-eex74cy" updated="20230628203216"><span data-type="mark">标记</span></p>
        <p id="20230628203216-i8pulgj" updated="20230628203216"><span data-type="sup">上标</span></p>
        <p id="20230628203216-kezmzh4" updated="20230628203216"><span data-type="sub">下标</span></p>
        <p id="20230628203216-ru5wry9" updated="20230628203216">&ZeroWidthSpace;<span data-type="kbd">快捷键</span>&ZeroWidthSpace;</p>
        <p id="20230628203216-v7ph5c7" updated="20230628203216">&ZeroWidthSpace;<span data-type="code">行内代码</span>&ZeroWidthSpace;</p>
        <p id="20230628203216-n5132ex" updated="20230628203216"><span data-type="inline-math" data-subtype="math" data-content="math" contenteditable="false" class="render-node" data-render="true"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">ma</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span></span></span></span></span>
        </p>
        <p id="20230628203216-ffj8wk6" updated="20230628203216">备注<sup>（这是一个行级备注）</sup></p>
    </body>
</html>
`,
};
