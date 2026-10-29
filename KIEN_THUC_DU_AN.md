# Kiến thức được sử dụng trong Stock Assistant

## 1. Kiến trúc client–server

Dự án được chia thành hai phần độc lập:

- `frontend`: giao diện React chạy bằng Vite, mặc định tại `http://localhost:5173`.
- `backend`: REST API Node.js/Express, chạy tại `http://localhost:3000`.
- Frontend gọi backend qua HTTP; backend gọi Finnhub và MongoDB.

## 2. Frontend: React và Vite

### React function component

Giao diện được viết dưới dạng function component:

- `App`: tải và lọc danh sách cổ phiếu.
- `StockCard`: hiển thị từng mã cổ phiếu và nút theo dõi.

### State với `useState`

`useState` lưu trạng thái thay đổi trong giao diện:

- `stocks`: danh sách cổ phiếu lấy từ API.
- `loading`: trạng thái đang tải dữ liệu.
- `error`: thông báo lỗi khi gọi API thất bại.
- `query`: nội dung người dùng nhập để lọc theo mã.
- `watching`: trạng thái theo dõi của một thẻ cổ phiếu.

### Side effect với `useEffect`

`useEffect(..., [])` chạy một lần khi `App` được mount. Bên trong effect, ứng dụng dùng `fetch` để gọi `GET /api/stocks` và cập nhật state theo kết quả trả về.

### Render có điều kiện và render danh sách

- Khi `loading` là `true`, hiển thị “Đang tải...”.
- Khi có `error`, hiển thị thông báo lỗi.
- `filter()` lọc mã cổ phiếu theo chuỗi tìm kiếm.
- `map()` chuyển từng phần tử dữ liệu thành component `StockCard`.
- `key={s.symbol}` giúp React nhận diện phần tử trong danh sách.

### Sự kiện và controlled input

Ô tìm kiếm dùng `value={query}` và `onChange`, nên đây là controlled component. Mỗi lần người dùng nhập, state `query` thay đổi và danh sách được lọc lại.

### Vite

Vite cung cấp dev server, build production và quá trình đóng gói frontend. Lệnh build hiện tại là:

```bash
cd frontend
npm run build
```

## 3. Backend: Node.js và Express

### Express server và routing

`backend/server.js` tạo ứng dụng Express và định nghĩa các endpoint:

- `GET /`: kiểm tra server.
- `GET /api/hello`: trả về lời chào và thời gian.
- `GET /api/stocks`: lấy giá cho danh sách mã định sẵn.
- `GET /api/stocks/:symbol`: lấy báo giá cho một mã.
- `/api/portfolio`: nhóm route quản lý danh mục.

### Middleware

Các middleware đang dùng:

- `express.json()`: đọc request body ở định dạng JSON.
- `cors(...)`: cho phép frontend tại `http://localhost:5173` gọi API trong môi trường phát triển.
- Middleware 404: trả JSON khi route không tồn tại.
- Error middleware 4 tham số: xử lý JSON body không hợp lệ và lỗi không lường trước.

### REST API và mã trạng thái HTTP

API áp dụng các HTTP status code phổ biến:

- `200`: đọc hoặc cập nhật thành công.
- `201`: tạo một holding mới thành công.
- `400`: body, dữ liệu hoặc MongoDB ObjectId không hợp lệ.
- `404`: không tìm thấy route, mã cổ phiếu hoặc holding.
- `500`: lỗi nội bộ hoặc lỗi thao tác cơ sở dữ liệu.
- `502`: không lấy được dữ liệu từ Finnhub.

## 4. JavaScript bất đồng bộ

### `async` / `await` và `try` / `catch`

Các thao tác I/O như gọi Finnhub hoặc MongoDB đều bất đồng bộ. Dự án dùng `async`/`await` để viết dễ đọc và `try`/`catch` để chuyển lỗi thành HTTP response phù hợp.

### `Promise.all`

Endpoint `/api/stocks` và `/api/portfolio/summary` dùng `Promise.all()` để lấy giá của nhiều mã song song, thay vì chờ từng request lần lượt.

## 5. Gọi API bên thứ ba: Finnhub

Service `backend/services/finhub.js` gọi endpoint quote của Finnhub bằng `fetch`.

Kiến thức liên quan:

- Xây URL có query string.
- `encodeURIComponent(symbol)` để mã hoá symbol trước khi đưa vào URL.
- Kiểm tra `response.ok` trước khi đọc JSON.
- Đọc JSON qua `response.json()`.
- Dùng biến môi trường `FINHUB_API_KEY` để không ghi API key trực tiếp vào source code.

## 6. In-memory cache

Service Finnhub dùng `Map` làm cache trong bộ nhớ:

- Key là mã cổ phiếu.
- Value chứa dữ liệu và thời điểm lưu (`time`).
- `CACHE_TTL_MS = 30 * 1000` nghĩa là dữ liệu có hiệu lực 30 giây.

Cache giảm số lần gọi Finnhub, tăng tốc response và hạn chế rủi ro chạm rate limit. Cache này sẽ mất khi backend khởi động lại và không được chia sẻ giữa nhiều instance server.

## 7. MongoDB và Mongoose

### Kết nối cơ sở dữ liệu

Backend dùng `mongoose.connect(process.env.MONGODB_URI)` để kết nối MongoDB. Chuỗi kết nối được đặt trong file `.env` thay vì source code.

### Schema và model

Model `Holding` mô tả một khoản nắm giữ gồm:

- `symbol`: mã cổ phiếu, được trim và chuyển uppercase.
- `quantity`: số lượng, kiểu `Number`, tối thiểu 0.
- `buyPrice`: giá mua, kiểu `Number`, tối thiểu 0.
- `createdAt`, `updatedAt`: tự động tạo nhờ `timestamps: true`.

### CRUD danh mục

Router `portfolio` minh hoạ CRUD:

- Create: `Holding.create()`.
- Read: `Holding.find()` và `sort()`.
- Update: `findByIdAndUpdate()` với `runValidators: true`.
- Delete: `findByIdAndDelete()`.

Trước khi cập nhật/xoá, `mongoose.isValidObjectId()` kiểm tra định dạng ID để tránh lỗi CastError không cần thiết.

## 8. Tính toán danh mục đầu tư

Endpoint `GET /api/portfolio/summary` kết hợp dữ liệu MongoDB với báo giá hiện tại để tính:

- `cost = quantity × buyPrice`.
- `value = quantity × currentPrice`.
- `profit = value - cost`.
- `profitPercent = (profit / cost) × 100` khi `cost > 0`.
- Tổng giá vốn, tổng giá trị, tổng lãi/lỗ của toàn danh mục.

Hàm `round2()` làm tròn số đến hai chữ số thập phân và xử lý trường hợp `null`.

## 9. Cấu hình và bảo mật cơ bản

- File `.env` chứa `FINHUB_API_KEY` và `MONGODB_URI`.
- Lệnh backend dùng `node --env-file=.env` để nạp biến môi trường.
- CORS giới hạn origin frontend trong môi trường local.
- API key và connection string không nên commit lên Git; `.env` nên nằm trong `.gitignore`.

## 10. Công cụ và lệnh phát triển

```bash
# Chạy backend
cd backend
npm run dev

# Chạy frontend
cd frontend
npm run dev

# Build frontend production
cd frontend
npm run build

# Lint frontend
cd frontend
npm run lint
```

## 11. Hướng phát triển tiếp theo

- Đưa URL API và CORS origin vào biến môi trường để deploy production.
- Lưu danh sách theo dõi vào state dùng chung, local storage hoặc MongoDB thay vì chỉ nằm trong từng `StockCard`.
- Thêm validation rõ ràng hơn cho `symbol`, `quantity` và `buyPrice`.
- Bổ sung test tự động cho API, service Finnhub và giao diện React.
- Thêm xác thực người dùng nếu mỗi người cần một danh mục riêng.
