// Copyright (C) 2023 SiYuan Community
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

/**
 * 基于 fetch 的最小 EventSource 实现，仅用于在没有全局 EventSource 的 Node.js 中测试 SSE
 * 支持事件名、多行 data 与 id；连接断开或响应不是事件流时触发 error 事件并关闭，不自动重连
 */
export class FetchEventSource extends EventTarget {
    public static readonly CONNECTING = 0;
    public static readonly OPEN = 1;
    public static readonly CLOSED = 2;

    public readonly CONNECTING = FetchEventSource.CONNECTING;
    public readonly OPEN = FetchEventSource.OPEN;
    public readonly CLOSED = FetchEventSource.CLOSED;

    public readonly url: string;
    public readonly withCredentials: boolean;
    public readyState: number = FetchEventSource.CONNECTING;
    public onerror: ((event: Event) => void) | null = null;
    public onmessage: ((event: MessageEvent) => void) | null = null;
    public onopen: ((event: Event) => void) | null = null;

    protected readonly _controller = new AbortController();

    constructor(url: string | URL, eventSourceInitDict?: EventSourceInit) {
        super();
        this.url = String(url);
        this.withCredentials = eventSourceInitDict?.withCredentials ?? false;
        void this._connect();
    }

    public close(): void {
        this.readyState = FetchEventSource.CLOSED;
        this._controller.abort();
    }

    protected _emit(event: Event): void {
        this.dispatchEvent(event);
        switch (event.type) {
            case "open":
                this.onopen?.(event);
                break;
            case "error":
                this.onerror?.(event);
                break;
            case "message":
                this.onmessage?.(event as MessageEvent);
                break;
            default:
                break;
        }
    }

    protected async _connect(): Promise<void> {
        try {
            const response = await fetch(this.url, {
                headers: { Accept: "text/event-stream" },
                signal: this._controller.signal,
            });
            if (!response.ok || !response.body || !response.headers.get("Content-Type")?.startsWith("text/event-stream")) {
                await response.body?.cancel();
                throw new Error(`unexpected response: ${response.status} ${response.headers.get("Content-Type")}`);
            }
            this.readyState = FetchEventSource.OPEN;
            this._emit(new Event("open"));

            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            const state = { buffer: "", type: "", data: [] as string[], id: "" };
            for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
                state.buffer += chunk.value;
                const lines = state.buffer.split("\n");
                state.buffer = lines.pop()!;
                for (const line of lines.map((l) => l.replace(/\r$/, ""))) {
                    if (line === "") {
                        /* 空行表示一个事件结束 */
                        if (state.data.length > 0) {
                            this._emit(new MessageEvent(state.type || "message", { data: state.data.join("\n"), lastEventId: state.id }));
                        }
                        state.type = "";
                        state.data = [];
                        continue;
                    }
                    if (line.startsWith(":")) {
                        continue;
                    }
                    const index = line.indexOf(":");
                    const field = index < 0 ? line : line.slice(0, index);
                    const value = index < 0 ? "" : line.slice(index + 1).replace(/^ /, "");
                    switch (field) {
                        case "event":
                            state.type = value;
                            break;
                        case "data":
                            state.data.push(value);
                            break;
                        case "id":
                            state.id = value;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        catch {
            /* 连接失败或被中断，下面统一处理 */
        }
        if (this.readyState !== FetchEventSource.CLOSED) {
            this.readyState = FetchEventSource.CLOSED;
            this._emit(new Event("error"));
        }
    }
}
