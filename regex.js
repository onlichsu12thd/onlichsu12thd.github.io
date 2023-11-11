// (?<=(Câu ))(\d){1,2}(?!=(A:))(.)*
// (?<=(A\.))(.)*(?=(B\.|\n( )*B))
// (?<=(B\.))(.)*(?=(C\.|\n( )*C))
// (?<=(C\.))(.)*(?=(D\.|\n( )*D))
// (?<=(D\.))(.)*
// 45 A 48 B 46 C 32 D
// 1 25 2 26 3 20 4 30 5 20 6 30 7 20 8 20 9 25 10 25

let qss = [];


function matchK1() {
    return k.match(/(?<=(Câu ))(\d){1,2}(?!=(A:))(.)*/gm);
}

function clean(v) {
    return v.map(e => {
        q = e.trim().substring(2).trim()
        if (q.startsWith(': ') || q.startsWith('. ')) q=q.substring(2);
        if (q.startsWith(':') || q.startsWith('.')) q=q.substring(1);
        return q.replace(/\s+/g,' ').trim();
    })
}

function matchA1() {
    a = k.match(/(?<=(A\.))(.)*(?=(( )*B\.|\n( )*?B)(?!âu))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    b = k.match(/(?<=(B\.))(.)*(?=(( )*C\.|\n( )*?C)(?!âu))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    c = k.match(/(?<=(C\.))(.)*(?=(( )*D\.|\n( )*?D)(?!âu))/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    d = k.match(/(?<=(D\.))(.)*/gm).map(e=>e.replace(/\s+/g,' ').trim()).filter(xx => xx!=="");
    af = []
    for (let i = 0; i<a.length; i++) {
        af[i] = [[a[i], 0],[b[i], 1],[c[i], 2],[d[i],3]]
    }
    return af;
}
const conv = {
    "A" : 0,
    "B" : 1,
    "C" : 2,
    "D" : 3
}
const rconv = ["A", "B", "C", "D"];
function loadAns() {
    return an.split("").map(e => conv[e]);
}

function assemble() {
    al = loadAns();
    let as = matchA1(), ks = clean(matchK1());
    sx = [];
    for (let i = 0; i<al.length; i++) {
        sx[i] = {
            q : ks[i],
            s : as[i],
            a : al[i]
        }
    }
    return sx;
}

let ss = [25, 26, 20, 30, 20, 30, 20, 20, 25, 25],
    cc = 4;
function lgen() {
    que = assemble()
    count = 0;
    qlist = [];
    for (let i = 0; i<10; i++) {
        for (let j = 0; j<cc; j++) {
            r = Math.floor(Math.random()*(ss[i]-j))
            e = que.splice(count+r,1);
            qlist.push(e);
            count-=1;
        }
        count+=ss[i];
    }
    qss = qlist;
    return qlist;
}

function renderQ(que) {
    document.getElementById("tlch").style.display = "none";
    document.getElementById("res").style.display = "none";
    qu = document.getElementById("qmain");
    qu.style.display = "";
    for (let i = 0; i<que.length; i++) {
        qu.insertAdjacentHTML("beforeend",`
<p>Câu ${i+1} : ${que[i][0]["q"]}</p><br>
<input type="radio" id="q${i}A" name="q${i}" value="A">
<label for="a1">A : ${que[i][0].s[0][0]}</label><br>
<input type="radio" id="q${i}B" name="q${i}" value="B">
<label for="b1">B : ${que[i][0].s[1][0]}</label><br>
<input type="radio" id="q${i}C" name="q${i}" value="C">
<label for="c1">C : ${que[i][0].s[2][0]}</label><br>
<input type="radio" id="q${i}D" name="q${i}" value="D">
<label for="d1">D : ${que[i][0].s[3][0]}</label><br><br>
        `)
    }
    qu.insertAdjacentHTML("beforeend",`
<form onsubmit="return false;" method="post" name="myForm">
<br><br><input type="submit" value="Nộp bài" onclick="ansk()" style="font-size: 200%;"> 
</form>
`)
}



function ansk() {
    let ansarr = new Array(40)
    for (let i = 0; i<40; i++) {
        try {
            v = document.querySelector(`input[name="q${i}"]:checked`).value
            ansarr[i] = conv[v];
        } catch {
            ansarr[i] = -1;
        }
    }
    let ac = 0;
    wr = [];
    cr = []
    ansarr.forEach((e, i) => {
        if (e===qss[i][0]["a"])  {
            ac+=1;cr.push([i, e, qss[i][0]])
        } else wr.push([i, e, qss[i][0]])
    });
    document.getElementById("tlch").style.display = "none";
    document.getElementById("qmain").style.display = "none";
    res = document.getElementById("res");
    res.style.display = "";
    res.insertAdjacentHTML("beforeend", `
<text id="nametext" style="font-family: Calibri;font-size: 300%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;display: block;">Kết quả</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 250%;font-weight: bold;color: rgb(20, 63, 66);text-align: center;display: block;">${ac}/40</text><br><br>
<button onclick="start()" style="text-align: center;margin:auto; display:block;font-size: 200%;">Tạo đề mới</button><br><br><br>
    `)
    console.log(cr);
    if (cr.length > 0) {
        res.insertAdjacentHTML("beforeend", `
        <text id="nametext" style="font-family: Calibri;font-size: 250%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;display: block;">Những câu đúng</text><br>
        `)
        cr.forEach((e,i) => {
            res.insertAdjacentHTML("beforeend", `
<div id="ed${i}" style="margin: 5%;">
<text id="nametext" style="font-family: Calibri;font-size: 200%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;">Câu ${e[0]+1}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 150%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">${e[2]["q"]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">A : ${e[2].s[0][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">B : ${e[2].s[1][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">C : ${e[2].s[2][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">D : ${e[2].s[3][0]}</text><br><br><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(30, 168, 18);text-align: center;">Đáp án đã chọn : ${e[1] === -1 ? "Không chọn" : rconv[e[1]]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(30, 168, 18);text-align: center;">Đáp án đúng : ${rconv[e[2]["a"]]}</text><br>
</div>
            `)
        });
  }
    res.insertAdjacentHTML("beforeend", `

<text id="nametext" style="font-family: Calibri;font-size: 250%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;display: block;">Những câu sai</text><br>
`)
    wr.forEach((e,i) => {
      res.insertAdjacentHTML("beforeend", `
<div id="e${i}" style="margin: 5%;">
<text id="nametext" style="font-family: Calibri;font-size: 200%;font-weight: bold;color: rgb(37, 117, 122);text-align: center;">Câu ${e[0]+1}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 150%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">${e[2]["q"]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">A : ${e[2].s[0][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">B : ${e[2].s[1][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">C : ${e[2].s[2][0]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(29, 158, 243);text-align: center;">D : ${e[2].s[3][0]}</text><br><br><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(243, 54, 29);text-align: center;">Đáp án đã chọn : ${e[1] === -1 ? "Không chọn" : rconv[e[1]]}</text><br>
<text id="nametext" style="font-family: Calibri;font-size: 120%;font-weight: bold;color: rgb(30, 168, 18);text-align: center;">Đáp án đúng : ${rconv[e[2]["a"]]}</text><br>
</div>
      `)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const an = "BBDDDBCCCCCBABBBABBDBBCCCDDCCCDDBCCABCBDBBBACBABBBBDABAAADCABAABADCBCDCABABADCADACACCBAADDCADAACACACBABAACBBCBDBCCDBCCDADCAADACDDACACAABBCACBABBDBAAABCACBBCCDDCCCADABCDCDDBDDACCBDBBACACDBAAABCCBCCDBCDCBBCCABACAABBDDAAADDBCCACBDBDCDACBACDADCC"


const k = `Câu 1. Hội nghị Ianta có sự tham gia của các nước 
A. Anh- Pháp- Mĩ.          
B. Anh- Mĩ- Liên Xô.        
C. Anh- Pháp- Đức   D. Mĩ- Liên Xô- Trung Quốc.
Câu 2 . Hội nghị Ianta diễn ra vào thời gian nào?
A. 14 đến 11-02-1945         
B. 04 đến 11-02-1945     
C. 02 đến 12-4-1945     D.12 đến 22-4-1945
Câu 3 . Hội nghị Ianta được họp tại nước
A. Ạnh                          
B. Pháp.                                    
C. Thụy Sĩ.            D. Liên Xô.
Câu 4 . Nguyên thủ các quốc gia tham gia Hội nghị Ianta gồm
A. Rudơven, Clêmăngxô, Sớcxin.                  B. Aixenhao, Xtalin, Clêmăngxô.
C. Aixenhao, Xtalin, Sớcxin.                          D. Sớcxin, Rudơven, Xtalin.
 Câu 5 .Theo thỏa thuận của Hội nghị Ianta vùng Đông Âu thuộc ảnh hưởng của nước
A. Mĩ                     
B. Anh                                             
C. Pháp             D. Liên Xô
Câu 6. Hội nghị Ianta (2-1945) diễn ra khi cuộc Chiến tranh thế giới thứ hai
A. đã hoàn toàn kết thúc.       B. bước vào giai đoạn kết thúc.   
C. đang diễn ra vô cùng ác liệt          D.ngày càng lan rộng.
Câu 7 .Từ vĩ tuyến 38 về phía Nam bán đảo Triều Tiên sau chiến tranh do lực lượng nào chiếm đóng
A. Quân đội Liên Xô.        
B.Quân đội Trung Quốc.         
C. Liên quân Anh – Mĩ.      
D.Liên quân Anh- Pháp
Câu 8 .Hội nghị Ianta có ảnh hưởng như thế nào đến tình hình quốc tế sau chiến tranh
A. làm nảy sinh những mâu thuẫn mới với các nước đế quốc.
B. đánh dấu sự hình thành một trật tự thế giới mới sau chiến tranh.
C. trở thành khuân khổ của một trật tự thế giới, từng bước được thiết lập trong những năm 1945-1947
D. đánh dấu sự xác lập vai trò thống trị thế giới của chủ nghĩa đế quốc Mĩ
Câu 9 .Đặc điểm nổi bật của trật tự thế giới mới được hình thành trong những năm sau chiến tranh TG thứ hai
A. là một trật tự thế giới được thiết lập trên cơ sở các nước tư bản thắng .
B. là một trật tự thế giới hoàn toàn do chủ nghĩa tư bản thao túng.
C. là một trật tự thế giới có sự phân tuyến triệt để giữa hai phe: XHCN và TBCN.
D. là một trật tự thế giới được thiết lập giữa các nước thắng ,hợp tác để thống trị, bóc lột các nước bại trận .
Câu 10. Nội dung gây nhiều tranh cãi nhất giữa ba cường quốc Liên Xô, Mỹ, Anh tại Hội nghị Ianta
A. Kết thúc chiến tranh thế giới thứ hai để tiêu diệt tận gốc chủ nghĩa PX Đức và chủ nghĩa quân phiệt Nhật.
B. Thành lập tổ chức quốc tế - Liên Hợp Quốc.
C.Phân chia khu vực chiếm đóng và phạm vi ảnh hưởng của các nước thắng trận,
 D. Giải quyết các hậu quả chiến tranh, phân chia chiến lợi phẩm.
Câu 11: Một trong những mục đích của tổ chức Liên hợp quốc là
 A. trừng trị các hoạt động gây chiến tranh                     B. thúc đẩy quan hệ thương mại tự do.
  C. duy trì hòa bình và an ninh thế giới.                      D. ngăn chặn tình trạng ô nhiễm môi trường.
Câu 12: Cơ quan nào của Liên Hợp Quốc giữ vai trò trong việc duy trì hòa bình và an ninh thế giới?
A.Đại hội đồng            
B.Hội đồng Bảo an.                            
C. Tổng thư kí           
D. Ban thư kí 
Câu 13:  Tại sao Hiến Chương Liên Hợp Quốc lại là văn kiện quan trọng nhất vì 
A.Hiến chương đã nêu rõ mục đích hoạt của LHQ    B.Nêu rõ mục đích nguyên tắc hoạt động của LHQ   
C.Là cơ sở để các nước tham gia tổ chức LHQ         D.Hiến chương qui định bộ máy của tổ chức LHQ
Câu 14: Việt Nam từ khi gia nhập Liên hợp quốc đã có đóng góp gì?
A.Xây dựng mối quan hệ hợp tác chặc chẽ có hiệu quả
B.Trở thành ủy viên không thường trực của hội đồng bảo an nhiệm kì 2008-2009
C.Có tiếng nói ngày càng quan trọng ở LHQ                      D.Tham gia tích cực các chương trình.
Câu 15: Việt Nam gia nhập Liên hợp quốc vào thời gian nào? Là thành viên bao nhiêu?
A.8/1977,thứ 148            
B.9/1977,thứ 149            
C.10/1977,thứ 150          
D.11/1977,thứ 151
 Câu 16. Địa danh nào được chọn để đặt trụ sở Liên Hợp Quốc:
A. Xan Phơranxixcô.   B. Niu Ióoc,       C. Oasinhtơn.    D. Caliphoócnia 
Câu 17 : 5 nước Ủy viên thường trực của hội đồng bảo an liên hợp quốc gồm 
A.Liên Xô, Mỹ, Anh, Pháp, Trung Quốc                 B.Nhật, Mỹ, Anh, Pháp, Trung Quốc
C.Liên Xô, Mỹ, Anh, Pháp, Đức.
D.Liên Xô, Mỹ, Anh, Đức, Trung Quốc
Câu 18: Ngày  kỉ niệm thành lập Liên hợp quốc  là ngày nào? 
A.Ngày 25/4/1945
B.Ngày 24/10/1945
C.Ngày 24/11/1945        D.Ngày 24/10/1946 
Câu 19 .Hiến chương Liên Hợp Quốc được thông qua tại Hội nghị nào ? Gồm bao nhiêu nước tham gia sáng lập?
A. Hội nghị Ianta,40 nước.                         B. Hội nghị Xanphranxcô, 50 nước.
C. Hội nghị Pôxđam, 60 nước.                        D. Hội nghị Pari, 70 nước.
Câu 20 . Tổng thư kí hiện nay của Liên hợp quốc là người nước nào? 
A. Mĩ                                  
B. Hàn Quốc                                   
C.Tây Ban Nha         
D.Bồ Đào Nha, 
 Câu 21 .Việc Việt Nam là ủy viên không thường trực của Hội đồng Bảo an Liên hợp quốc có ý nghĩa 
A. tạo cơ hội để Việt Nam hòa nhập với cộng đồng quốc tế.
B. nâng cao vị thế quốc tế của Việt Nam trên trường thế giới.
C. nâng cao hiệu quả hợp tác kinh tế, chính trị của Việt Nam với các nước.
D. góp phần thúc đẩy việc nhanh chóng ký kết các hiệp định thương mại của nước ta.
Câu 22 . Số lượng thành viên của tổ chức Liên hợp quốc ngày càng đông nói lên điều gì
A. Liên hợp quốc là một tổ chức có vai trò to lớn trong việc thúc đẩy kinh tế.
B. .Liên hợp quốc ngày càng trở thành một tổ chức đáng tin cậy có vị trí cao trên trường quốc tế.
C. .Liên hợp quốc là một tổ chức đóng góp to lớn trong việc giải quyết các tranh chấp quốc tế.
D. Liên hợp quốc góp phần quan trọng trong thúc đẩy phát triển kinh tến, văn hóa.
Câu 23  . Những nguyên tắc hoạt động của tổ chức Liên hợp quốc có ý nghĩa như thế nào?
A. là cơ sở pháp lý cơ bản để tổ chức Liên hợp quốc duy trì hoạt động.
B. là cơ sở bắt buộc để Liên hợp quốc thực hiện các hoạt động.
C. là cơ sở pháp lý cho sự tồn tại và những hoạt động của tổ chức này.
D. là cơ sở lý luận cho Liên hợp quốc xây dựng  những đường lối kinh tế chính trị.
Câu 24 . Vai trò lớn nhất của Liên hợp quốc hiện nay là:
A. thúc đẩy quan hệ hợp tác kinh tế, văn hóa giữa các quốc gia, khu vực.
B. là trung gian giải quyết các tranh chấp trên lĩnh vực kinh tế.
C. góp phần gìn giữ hòa bình an ninh và các vấn đề mang tính quốc tế.
D. là trung tâm giải quyết những mâu thuẫn vê dân tộc, sắc tộc trên thế giới.
Câu 25. Hiện nay Việt Nam vận dụng nguyên tắc cơ bản nào của Liên hợp quốc để đấu tranh bảo vệ chủ quyền biển đảo?
A. bình đẳng chủ quyền giữa các quốc gia và quyền tự quyết của các dân tộc.
B. không can thiệp vào công việc nội bộ của bất kỳ nước nào.
C. giải quyết các tranh chấp quốc tế bằng biện pháp hòa bình.
D. Thực hiện quyền tự quyết của các dân tộc.
BÀI 2: LIÊN XÔ VÀ CÁC NƯỚC ĐÔNG ÂU ( 1945-1991).
LIÊN BANG NGA (1991- 2000)
  Câu 1.  Tại sao từ năm 1946- 1950 Liên Xô phải tiến hành công cuộc khôi phục kinh tế?
A. Muốn xây dựng nền kinh tế mạnh để cạnh tranh với Mĩ.
B. Liên Xô muốn xây dựng cơ sở vật chất cho chủ nghĩa xã hội.
C. Muốn đưa Liên Xô trở thành cường quốc công nghiệp đứng đầu thế giới.
D. Liên Xô phải chịu những tổn thất nặng nề nhất trong Chiến tranh thế giới thứ hai.
 Câu 2. Thắng lợi lớn mà Liên Xô đạt được trong giai đoạn( 1946- 1950) là 
A. chế tạo thành công bom nguyên tử.                 B. phóng thành công vệ tinh nhân tạo.
C. thành lập Liên bang cộng hòa xã hội chủ nghĩa xô viết
D. hoàn thành trước thời hạn kế hoạch 5 năm khôi phục kinh tế.
 Câu 3. Thành tựu nổi bật mà Liên Xô đạt được năm 1949 là
A. phóng thành công  tàu vũ trụ                             B. trở thành cường quốc công nghiệp thứ hai thế giới.
C. chế tạo thành công bom nguyên tử.                     D. phóng thành công vệ tinh nhân tạo.
  Câu 4. Xác định khó khăn lớn nhất của Liên Xô sau khi chiến tranh thế giới thứ hai kết thúc?
A. hơn 32.000 xí nghiệp bị tàn phá.                            B. hơn 7000 làng mạc bi tiêu hủy.
C. hơn 27 triệu người chết.                                     D. hơn 1710 thành phố bị đổ nát.
Câu 5. Thành tựu quan trọng nhất mà Liên Xô đạt được sau chiến tranh là
A. chế tạo thành công bom nguyên tử .                              
B. phóng thành công vệ tinh nhân tạo. 
C. trở thành cường quốc công nghiệp đứng thứ hai thế giới. 
D. nước đầu tiên phóng thành công tàu vũ trụ có người lái.
Câu 6. Hoàn cảnh Liên Xô bước vào công cuộc khôi phục kinh tế sau Chiến tranh thế giới thứ hai là
A. bán được nhiều vũ khí trong chiến tranh.           B. thu được nhiều chiến phí do Đức và Nhật bồi thường.
C. Được nhiều thuộc địa ở Đông Âu.                 D.chịu tổn thất nặng nề nhất trong Chiến tranh thế giới thứ hai. 
Câu 7. Lĩnh vực đi đầu trong công cuộc xây dựng CNXH của Liên Xô từ năm 1950 đến nửa đầu những năm 70 của thế kỷ XX là
A. công nghiệp quốc phòng.                            B. công nghiệp hàng tiêu dùng.
C. công nghiệp nặng, chế tạo máy móc.          D. công nghiệp vũ trụ, công nghiệp hạt nhân
Câu 8. Sản lượng nông phẩm của Liên Xô trong những năm 60 của thế kỷ XX tăng trung bình hàng năm
A. 15%   
B. 16%   
C. 17%  
D. 18%
  Câu 9. Nguyên nhân cơ bản nhất làm cho chủ nghĩa xã hội ở Liên Xô và Đông Âu sụp đổ
A. Chậm sửa chữa sai lầm.                 B. Sự chống phá của các thế lực thù địch.
C. Xây dựng mô hình chủ nghĩa xã hội chưa phù hợp.      D. Không bắt kịp sự  phát triển của khoa học kĩ thuật .
 Câu 10. Ai là người đầu tiên bay vào vũ trụ,người nước nào,năm bao nhiêu?
A.  Gagarin  người Liên Xô,năm 1959                        B. Cô- pec-nic nước Anh,năm 1960.
C. Gagarin. nước Liên Xô,năm 1961                             D. Amstrong,nước Mĩ,năm 1969.
   Câu 11. Hiện nay nền kinh tế Nga đứng hàng thứ mấy trên thế giới
A. đứng thứ 10 thế giới.   B. đứng thứ 11 thế giới.   C. đứng thứ 12 thế giới.              D. đứng thứ 13 thế giới.
    Câu 12. Hiện nay trên thế giới các nước xã hội chủ nghĩa còn lại là
A. Lào, Triều Tiên, Trung Quốc, Cam pu chia.                B. Việt Nam, Triều Tiên, Trung Quốc, Cu Ba..
C. Cu Ba, Cam pu chia, Lào, Trung Quốc.                  D. Trung Quốc, Triều Tiên, Cu ba, Lào.
 Câu 13. Bài học kinh nghiệm mà Đảng ta rút ra từ sự khủng hoảng của chủ nghĩa xã hội của Liên Xô là
A. thực hiện đường lối trung lập.                       B. thực hiện đa nguyên đa đảng.
C. giữ vững vai trò lãnh đạo của Đảng.              D. đẩy mạnh phát triển kinh tế.
Câu 14. Nét nổi bật trong đường lối đối ngoại của Liên bang Nga từ 1991- 2000 là ngả về phương Tây và
A. đối đầu quyết liệt với Mĩ.                         B. khôi  phục và phát triển quan hệ với các nước châu Á.
C. đẩy mạnh hợp tác với Mĩ.                       D. phát triển mối quan hệ với các nước Mĩ la tinh.
   Câu 15: Sự sụp đổ của chủ nghĩa xã hội ở liên Xô và Đông Âu được hiểu là
A. chủ nghĩa xã hội khoa học không thể thực hiện được trong hiện thực.
B. chủ nghĩa xã hội đã lỗi thời.                                  C. đó là  một tất yếu khách quan.
D. đó chỉ là sự sụp đổ của mô hình chủ nghĩa xã hội chưa đúng đắn.
 Câu 16. I. Gagarin là
A.  người đầu tiên đặt chân lên mặt trăng.          B. nhà du hành vũ trụ đầu tiên bay vòng quanh Trái đất.
C. người đầu tiên thám hiểm sao hỏa.                  D. người đã chế tạo thành công vệ tinh nhân tạo.    
  Câu 17. Hiến pháp tháng 12 – 1993  ban hành, quy định thể chế nước Nga là
A. Thủ tướng Liên bang.
B. Tổng thống Liên bang
C. Tổng bí thư
D. Chủ tịch nước.
Câu 18. Chuyến thăm đầu tiên của V. Pu tin đến Việt Nam diễn ra vào năm?
A. năm 2000         
B. năm 2001      
C. năm 2002                    D. năm 2003
Câu 19 :Từ năm 2000 tình hình Liên Bang Nga như thế nào?
A. Kinh tế phục hồi và phát triển ,chính trị-xã hội tương đối ổn định.    B.Vẫn phải đương đầu với khủng bố. 
C.Tình hình kinh tế chính trị rối ren.                                                        D. Thực hiện chạy đua vũ trang
Câu 20: Chính sách đối ngoại của Liên Xô từ năm 1945 đến nửa đầu những năm 70 thế kỉ XX là gì ?
A.Muôn làm bạn với tất cả các nước.                           B.Chỉ quan hệ với các nước lớn.
C. Hòa bình và tích cực ủng hộ cách mạng thế giới.       D. Chỉ làm bạn với các nước XHCN
Câu 21. Năm 1973 diễn ra sự biến gì có ảnh hưởng rất lớn đối với các nước? 
A. Khủng hoáng kinh tế   B. Khủng hoỏng năng lượng
C. Khủng hoảng chính trị   D.Khủng hoảng tài chính.
Câu 33. Hội đồng tương trợ kỉnh tế (SEV) được thành lập vào thời gian nào?
A.Ngày 8-1-1949.  
B. Ngày 1-8-1949.              
C. Ngày 18-1-1950    D.Ngày14-5-1955.
Câu 22. Mục đích của việc thành lập Hội đồng tương trợ kinh tế là gì?
A.Tạo ra mối quan hệ chặt chẽ về kinh tế giừa các nước Đông Âu với nhau.
B.Thúc đẩy sự hợp tác, giúp đờ lần nhau về kinh tế, văn hóa và khoa học-kĩ thuật giữa Liên Xô với các nước Đông Âu và các nước XHCN khác.
C.Tạo ra một cộng đồng kinh tế của các nước xă hội chủ nghĩa giàu mạnh.
D.Thúc đẩy sự hợp tác, giúp đờ lần nhau về kinh tế
Câu 23. Tố chức hiệp ước Vác-sa-va được thành lập vào thời gian nào?
A.Ngày 8- 1-1949.     
B. Ngày 14- 5-1955.   
C.Ngày 15-4-1955.  
D. Ngày 16- 7-1954
Câu 24. Sau khi Liên Xô sụp đổ, Liên bang Nga trở thành:
A.Trở thành quốc gia độc lập như các nước cộng hòa khác.
B. Trở thành quốc gia kế tục Liên Xô ,được thừa nhận địa vị pháp lí của LX.
C. Trở thành quốc gia nắm mọi quyền hành ở Liên Xô.
D. Trở thành quốc gia Liên bang Xô viết.
 Câu 25. Ngày 28-6-1991 diễn ra sự kiện gì gắn với các nước xã hội chủ nghĩa?
A. Chế độ XHCN tan rã ở Đông Âu và Liên Xô                      
B. Hội đồng Tương trợ kinh tế tuyên bố giải thể
C. Tổ chức Hiệp ước Vác-sa-va tuyên bố chấm dứt hoạt động 
D. Liên Xô tuyên bố cắt đứt quân hệ với các nước Đông Âu.
                    Bài 3: CÁC NƯỚC ĐÔNG BẮC Á
Câu 1: Thời gian thành lập nước cộng hoà nhân dân Trung Hoa?
A.tháng 1/10/1946          
B.tháng 1/10/1947          
C.tháng 1/10/1948          
D.tháng 1/10/1949
Câu 2 : Những nước nào được mệnh danh là “ 3 con rồng” ở châu Á?
A.Hàn Quốc, Hồng Kong,  Đài Loan                
B.Hàn Quốc, Hồng  Kong,  Trung Quốc
C.Hàn Quốc, Việt Nam,  Đài Loan                      
D.Trung Quốc, Hồng Kong,  Đài Loan
 Câu 3 : Nước nào có tốc độ kinh tế tăng trưởng nhanh và cao nhất thế giới từ đầu TK XXI
A.Nhật Bản  B. Trung Quốc  C. Hồng Công   D. Đài Loan

Câu 4 : Nhà nước Đại hàn dân quốc được thành lập năm nào?
A.tháng 8/1948           B.tháng 8/1949                 C.tháng 8/1950          D.tháng 8/1951

Câu 5. Sau chiến tranh thế giới thứ 2 Đông Bắc Á có những chuyển biến quan trọng nào?
A.Nước CHND Trung Hoa ra đời(1/10/1949) ,bán đảo Triều Tiên với sự ra đời của 2 nhà nước Đại Hàn Dân Quốc và CHDCNDTriều tiên.
B. Bán đảo Triều Tiên bị chia làm 2 miền theo vĩ tuyến 38
C. Sự sự ra đời của 2 nhà nước Đại Hàn Dân Quốc (8/1948) và Cộng hòa Dân chủ nhân dân Triều tiên(9/1948)
D. Quan hệ giữa hai nhà nước này đối đầu căng thẳng.
Câu 6. Trước sự lớn mạnh của Cách mạng Trung Quốc, tập đoàn Tưởng Giới Thạch thực hiện âm mưu gì?
A..Phát động cuộc nội chiến nhằm tiêu diệt Đảng cộng sản và phong trào cách mạng Trung Quốc.
B.Cấu kết với đế quốc Mĩ để tiêu diệt cách mạng Trung Quốc,
C. Đưa 50 vạn quân sang Mĩ để huấn luyện quân sự.
D.Huy động toàn bộ lực lượng quân đội chính quy tấn cồng vào  Đảng Cộng sản .
Câu 7 : Cuộc nội chiến giữa Quốc dân Đảng và Đảng cộng sản ở Trung Quốc nổ ra là do?
A.Đảng cộng sản phát động.
B.Do đế quốc phát động.
C. Cả hai bên phát động.
D. Quốc dân Đảng phát động.
Câu 8: Đặc điểm chính sách đối ngoại của Trung Quốc 1979 đến nay là?
A.Tiếp tục đường lối đóng cửa                                                     
B.Duy trì hai đường lối bất lợi cho Trung Quốc
C.Mở rộng quan hệ hữu nghị hợp tác với các nước trên thế giới   
D.Chỉ mở rộng quan hệ hợp tác với các nước XHCN  
Câu 9: Cuộc cải cách mở cửa của Trung Quốc bắt đầu vào thời gian nào?
A.12/1978                              B.12/1979                    C.12/1980                              D.12/1981

Câu 10: Ai là người khởi xướng cuộc cải cách mở cửa ở Trung Quốc?
A.Mao Trạch Đông   
B.Đặng Tiểu Bình      
C.Lưu Thiếu Kỳ               
D.Giang Thanh
 Câu 11: Mục tiêu của cuộc cải cách mở cửa năm 1978 ở Trung Quốc là?
A.giàu mạnh, dân chủ, văn minh           B.tự do, bình đẳng, bác ái         C.nâng cao dân trí     D.độc lập tự chủ

Câu 12: Nhiệm vụ trung tâm của cuộc cải cách 1978 là gì?
A.phát triển kinh tế là trọng tâm     B.phát triển văn hoá xã hội   
C.cải cách và mở cửa      D.xây dựng quốc gia giàu mạnh
Câu 13: Từ 1978 trở đi trong chính sách đối ngoại của mình, Trung Quốc bình thường hoá quan hệ với các nước nào?
A.Mỹ, Liên Xô, Mông Cổ, In-đô-nê-xi-a                B. Liên Xô, Mông Cổ, Lào, In-đô-nê-xi-a, Việt Nam
C. Liên Xô, Mông Cổ, Việt Nam, Cu ba               D.Mỹ, Liên Xô, Anh, Pháp, Cu ba
Câu 14: Sau 20 năm đổi mới nền kinh tế Trung Quốc có biến đổi gì?
A.tiến bộ nhanh chóng
B.tiến bộ không đáng kể
C.không có tiến bộ
D.kinh tế đi xuống

Câu 15: Chính sách đối ngoại của Trung Quốc từ những năm 80 của thế kỷ XX đến nay?
A.thực hiện đường lối bất lợi cho cách mạng Trung Quốc           B.bắt tay với Mỹ chống lại Liên Xô
C.gây chiến tranh xâm lược biên giới phía bắc Việt Nam  
D.mở rộng quan hệ hữu nghị hợp tác với các nước trên thế giới
 Câu 16: Ý nghĩa quốc tế về sự ra đời của nước cộng hoà nhân dân Trung Hoa là?
A.kết thúc hơn 100 năm nô dịch và thống trị của đế quốc đối với nhân dân Trung Hoa.
B.báo hiệu sự kết thúc ách thống trị nô dịch của phong kiến tư sản mại bản.
C.tăng cường lực lượng của CNXH và sức mạnh của phong trào giải phóng dân tộc..
D.đưa nhân dân Trung Quốc vào kỷ nguyên độc lập tự do và xây dựng CNXH.
Câu 17:  Yếu tố nào sau đây quyết định sự phát triển của phong trào giải phóng dân tộc ở các nước châu Á sau Chiến tranh thế giới thứ hai? 
A.Sự suy yếu của các nước đế quốc chủ nghĩa phương Tây. 
B.Ý thức độc lập và sự lớn mạnh của các lực lượng dân tộc.  
C. Thắng lợi của phe Đồng minh trong  chống phát xít.       
D. Hệ thống XHCN hình thành và ngày càng phát triển.
Câu 18. Ý nghĩa quốc tế về sự ra đời của nước Cộng hòa nhân dân Trung Hoa là gì?
A.Kêt thúc hơn 100 năm nô dịch và thống trị của đê quốc đối với nhân dân Trung Hoa.
B.Báo hiệu sự kết thúc ách thông trị, nô dịch của chế độ phong kiến tư bản trên đất Trung Hoa.
C.Tăng cường lực lượng của CNXH thê giới và tăng cường sức mạnh của phong trào giải phóng dân tộc 1
D.Đất nước Trung Hoa bước vào kí nguyên độc lập tự do, tiến lên chủ nghĩa xã hội
Câu 19. Từ sau 1987, đường lối của Đảng Cộng sản Trung Quốc có gì mới so với trước?
A.Kiên trì con đường xà hội chủ nghĩa.             B.Kiên trì cải cách dân chủ nhân dân.
C. Kiên trì sự lănh đạo của Đảng cộng sản Trung Quồc.         D.Thực hiện cải cách mở cửa 
Câu 20. Nước cộng hòa dân chủ nhân dân Triều Tiên được thành lập vào thời gian nào
A. Tháng 12-1945.        B. Tháng 8-1948.                C. Tháng 9-1948.            D. Tháng 10-1945
Bài 4: Đông Nam Á và Ấn Độ 
Câu 1 : Thành tựu nổi bật nhất của các nước Đông Nam Á từ giữa thế kỷ XX đến nay:
A.Trở thành các nước độc lập, thoát khỏi ách thuộc địa và phụ thuộc vào các thế lực đế quốc,
B.Trở thành khu vực năng động và phát triển nhất trên thế giới.
C. Trở thành một khu vực hòa bình, hợp tác, hữu nghị.
D. Có nhiều thành tựu to lớn trong công cuộc xây dựng đất nước và phát triển kinh
Câu 2.Tại sao sau năm 1945 nhiều nước Đông Nam Á vẫn phải đấu tranh giành và bảo vệ độc lập ?
A.Quân phiệt Nhật trở lại xâm lược                B.Thực dân Âu-Mĩ quay trở lại tái chiếm Đông Nam Á.
C. Thực dân Mĩ-Hà Lan xâm lươc trở lại .           D. Thực dân Pháp  trở lại xâm lược.
Câu 3.  Sau chiến tranh TG thứ hai  cơ hội thuận lợi để các nước Đông Nam Á đấu tranh giành độc lập là?
A.Nhật đầu hàng đồng minh không điều kiện         B. Sau chiến tranh thê giới thứ hai  kết thúc.
C.Quân đồng minh chiếm đóng Nhật 
D.Liên xô giúp đỡ phong trào giành độc lập đối với các nước Đông Nam Á.
Câu 4:Từ năm 1954 đến năm 1975, nhiệm vụ chung của cách mạng ba nước Đông Dương là
A. kháng chiến chống Pháp.
B. kháng chiến chống Mĩ. 
C. xây dựng CNXH.   D. chống Khơme Đỏ
Câu 5. Ngay sau khi Chiến tranh thê giới thứ hai kết thủc, ở châu Á phong trào giải phóng dán tộc đã nồ ra mạnh mẽ nhất vào năm 1945 ở các nước nào?
A.In-đô-nê-xi-a, Việt Nam, Lào.  B. Việt Nam, Mi-an-ma, Lào.
C. In-đồ-nê-xi-a, Xin-ga-po, Thái Lan.                     D. Phi-lip-pin, Việt Nam, Ma-laii-xi-a.
Câu 6. Trước CTTG thứ hai, hầu hết các nước Đông Nam Á (trừ Thái Lan) là thuộc địa của các nước 
A.Thuộc địa của Mỹ,Nhật.              B.Thuộc địa của Pháp, Nhật,
C.Thuộc địa của Anh, Pháp, Mĩ.    D.Thuộc địa của các thực dân Âu-Mĩ.
Câu 7. Đế quốc nào là lực lượng thù địch lớn nhất của phong trào giải phóng dân tộc ở khu vực Đông Nam Á sau CTTG thứ hai?
A.Đế quốc Hà Lan.             
B.Đế quốc Pháp,             
C. Đế quốc Mĩ.         
D.Đế quốc Anh. 
 Câu 8: ASEAN ra đời trong hoàn cảnh lịch sử là
A. các quốc gia vừa giành độc lập, trong điều kiện rất khó khăn, cần hợp tác với nhau để cùng phát triển.
B. các quốc gia vừa giành độc lập, bước vào thời kì phát triển kinh tế,cần bắt tay với nhau để phát triển.
C. các quốc gia vừa giành độc lập, trong điều kiện bị các nước đế quốc đe dọa, cần hợp tác để cùng phát triển.
D. các quốc gia vừa giành độc lập,thích hợp tác với nhau để cùng phát triển.
  Câu 9: Sự kiện nổi bật nào diễn ra vào năm 1967 tại thủ đô Băng cốc (Thái Lan) ?
A. Thành lập tổ chức Liên hợp quốc                   B. Thành lập tổ chức NATO
C. Thành lập tổ chức EU                                      D.  Thành lập tổ chức ASEAN
 Câu 10 : 5 quốc gia tham gia sáng lập tổ chức ASEAN là
A. Inđônêxia, Malaixia, Xingapo, Thái Lan, Philippin         B. Inđônêxia, Malaixia, Xingapo, Thái Lan, Brunây
C. Inđônêxia, Malaixia, Xingapo, Thái Lan, Campuchia      D. Inđônêxia, Malaixia, Xingapo, Thái Lan, Lào
Câu 11 : Một trong những mục tiêu cơ bản hoạt động của tổ chức ASEAN là
A. hợp tác toàn diện cùng phát triển                 B. hợp tác kinh tế để phát triển khu vực
C. duy trì hòa bình và ổn định khu vực            D. bảo vệ hòa bình và an ninh thế giới  
 Câu 12 : Nguyên tắc hoạt động cơ bản của tổ chức ASEAN trong hiệp ước Bali (Inđônêxia) là
A. hợp tác, phát triển có hiệu quả trong các lĩnh vực kinh tế, văn hóa, xã hội 
B. hợp tác, phát triển có hiệu quả trong các lĩnh vực kinh tế, chính trị, xã hội
C. hợp tác, phát triển có hiệu quả trong các lĩnh vực kinh tế, văn hóa, an ninh
D. hợp tác, phát triển có hiệu quả trong các lĩnh vực kinh tế, chính trị, an ninh
Câu 13 : Tổ chức ASEAN ngày nay được đánh giá là 
A. tổ chức hợp tác thành công                               B. hợp tác thành công nhất châu Á
C. tổ chức « năng động » nhất thế giới                  D. đã có vị trí trên trường quốc tế 
 Câu 14 : Mối quan hệ giữa các nước Đông Dương và ASEAN sau Hội nghị cấp cao Bali (Inđônêxia) là
A. căng thẳng, chạy đua vũ trang.                          B. đối thoại, hòa dịu.
C. bước đầu được cải thiện.                                    D. bắt tay, hợp tác.
Câu 15:Tổ chức Asean thành lập nhằm.
A.Xóa bỏ kinh tế nghèo nàn lạc hậu xây dựng kinh tế tự chủ.
B.Phát triển kinh tế Và văn hóa thông qua hợp tác chung giữa các nước thành viên trên tinh thần duy trì hòa bình và ổn định khu vực.
C.Chống lại sự xâm lược của Mĩ
D.Hình thành liên minh quân sự để bành chướng ra bên ngoài.
 Câu 16.  Sự kiện đánh dấu sự khởi sắc của tổ chức ASEAN là:
A.Hội nghị Bali tháng 2/1976              
B.Năm 2007 Hiến chương ASEAN được thông qua
C.Năm 1992 thành lập khu vực mậu dịch tự do Đông Nam Á(AFTA)
D.Năm 1996 thành lập diễn đàn hợp tác Á Âu
Câu 17 : Từ năm 1979 đến năm 1991, cách mạng Campuchia bước vào thời kì
A. nội chiến.        
B. kháng chiến chống Mĩ.           
C. xây dựng đất nước. 
D. kháng chiến chống Pháp. 
 Câu 18. Hiệp hội các nước Đông Nam Á (ASEAN) được thành lập vào thời gian nào? Tại đâu?
A.Tháng 8/8/1967. Tại Gia-cac-ta (In-đô-nê-xi-a).       
B.Tháng 9/8/1968. Tại Băng Cốc (Thái Lan), 
C.Tháng 9/10/1967. Tại Ba-li (In-đô-nê-xi-a D.Tháng8/8/1967.Tại Băng Cốc (Thái Lan).
Câu 19 : Thành viên thứ 7 của tổ chức ASEAN là nước     
A. Brunây 
B. Lào             
C. Campuchia
D. Việt Nam   
 Câu 20: Ngày 28/7/1995 là ngày diễn ra sự kiện tiêu biểu gì trong ngành ngoại giao Việt Nam ?
A. Việt Nam tham gia WTO
B. Việt Nam tham gia Liên hợp quốc 
C. Việt Nam tham gia ASEAN
D.  Mĩ bỏ lệnh cấm vận Việt Nam   
 Câu 21: Năm 1999  tổ chức ASEAN kết nạp thêm nước nào ?là thành viên bao nhiêu
A. Campuchia - thứ 10.
B. Lào - thứ 8.
C. Brunây-  thứ 6.
D. Việt Nam- thứ 7.                                                            
 Câu 22: Tháng 11/2007, các nước thành viên ASEAN đã kí kết văn kiện gì?
A. Nguyên tắc hoạt động của ASEAN                        B. Cam kết hợp tác ASEAN
C. Hiến chương Liên hợp quốc                                   D. Hiến chương ASEAN
Câu 23: Sự kiện diễn ra ở Đông Timo ngày 20/5/2002 là:
A. trở thành quốc gia độc lập.                                                    B. tách ra khỏi Inđônexia.
C. thoát khỏi ách thống trị của thực dân Phương Tây.                 D. gia nhập Asean. 
  Câu 24 : Quốc gia nào ở Đông Nam Á trở thành con rồng kinh tế châu Á?
A. Xingapo.
B. Malaixia.
C. Philippin.
D. Thái Lan
Câu 25. Ấn Độ tuyên bô độc lập vào thời gian nào?
A. Ngày 25- 12 - 1950.
B. Ngày 26 - 1 - 1950.
C. Ngày 23- 2 - 1950.
D.Ngày 26 - 1 - 1951.
Câu 26: Thủ tướng đầu tiên của Ấn Độ là
A. Nê ru
B. L.B Saxtri
C. Inđira Ganđi
D. Ragip Ganđi          
Câu 27: Cuộc đấu tranh giải phóng dân tộc của nhân dân Ấn Độ dưới sự lãnh đạo của 
A. Đảng Tự do Ấn Độ                                     B. Đảng vô sản Ấn Độ 
C. Đảng Quốc Đại Ấn Độ                                D. Đảng Dân tộc chủ nghĩa Ấn Độ  
   Câu 28: „Phương án Maobáttơn“ chia Ấn Độ thành 2 quốc gia trên cơ sở tôn giáo là
A. Ấn Độ của người theo Ấn Độ giáo, Pakixtan của người theo Hồi giáo
B. Ấn Độ của người theo Ấn Độ giáo, Pakixtan của người theo Phật giáo
C. Ấn Độ của người theo Thiên chúa giáo, Pakixtan của người theo Hồi giáo
D. Ấn Độ của người theo đạo Tin Lành, Pakixtan của người theo Hồi giáo
Câu 29: Ấn Độ tiến hành cách mạng nào đã giúp cho Ấn Độ từ năm 1995 là nước xuất khẩu gạo đứng thứ 3 trên thế giới ?
A. Cách mạng công nghiệp
B. Cách mạng tin học
C. Cách mạng xanh
D. Cách mạng trắng                         
 Câu 30: Ấn Độ trở thành một trong những nước sản xuất phần mềm lớn nhất thế giới vì đã tiến hành 
A. cách mạng công nghiệp         B. cách mạng tin học              C. cách mạng xanh        D. cách mạng trắng                       
 Bài 5: CÁC NƯỚC CHÂU PHI VÀ KHU VỰC MĨ LA TINH
Câu 1: Khu vực đầu tiên bùng nổ phong trào đấu tranh giành độc lập của nhân dân châu Phi là 
A. Bắc Phi
B. Nam Phi
C. Tây  Phi
D. Đông Phi.
Câu 2: Quốc gia giành độc lập sớm nhất ở châu Phi là
 A. Angiêri.
B. Ai Cập.
C. Ghinê.
D.Tuynidi. 
Câu 3: Sau thắng lợi của nhân dân nước nào chủ nghĩa thực dân cũ ở châu Phi cơ bản bị tan rã năm 1975?
A. Môdămbích- Ănggôla   
B. Tuynidi- Marốc.
C. Angiêri- Ai Cập.
D. Gana- Ghinê.
Câu 4: Thời điểm đánh dấu bước phát triển mới của phong trào giải phóng dân tộc ở Mĩ Latinh là 
A. năm 1959 thắng lợi của cách mạng Cuba.        B.đến năm 1983 ở vùng Caribê có 13 quốc gia giành độc lập.
C. năm 1999 với việc Mĩ trả lại kênh đào Panama.        D. những năm 60 – 70 phát triển phong trào  chống Mĩ.
Câu 5: Chủ nghĩa thực dân cũ ở châu Phi cơ bản bị tan rã vào năm
A. 1953.  
B. 1960.
C. 1975.
D. 1980.
Câu 6: Quốc gia nào là lá cờ đầu của phong trào giải phóng dân tộc ở Mĩ Latinh?
A. Haiti.
B. Cuba.
C. Áchentina.
D. Mêxicô
Câu 7. Trong cuộc đấu tranh chống chủ nghĩa thực dân kiểu mới, Mỹ latinh đã được mệnh danh là:
A. 'Hòn đảo tự do'
B. 'Lục địa bùng cháy'.
C. 'Đại lục núi lửa'
D.'Tiền bối của chủ nghĩa xã hội'..
Câu 8: Vì sao  sau chiến tranh thế giới thứ hai, Mĩ la tinh được mệnh danh là 'Đại lục bùng cháy'?
A. Ở đây thường xuyên xãy ra cháy rừng .                     
B. Ở đây nhân dân đã đứng lên chống đế quốc Mĩ .
C. Ở đây phong trào diễn ra mạnh mẽ,tiêu biểu thắng lợi ở Cuba .
D. Các nước đế quốc dùng Mĩ la tinh làm bàn đạp tấn công vào nước Mĩ .
Câu 9. Cuộc cách mạng của nhân dân Cu Ba thắng lợi hoàn hoàn được đánh dấu bằng sự kiện nào ?
A.Cuộc tấn công trại lính Moocada của 153 thanh niên yêu nước do Phiden Catxtoro lãnh đạo (7/1953).
B.Phiden Catxtoro cùng 81 chiến sĩ trở về nước, phát động nhân dân đấu tranh vũ trang,lật đổ chế độ độc tài,thành lập nước cộng hòa Cu Ba(1/1/1959)
C. Tấn công vào bãi biển Hiron                                            
D.Tấn công vùng núi Xiera
Câu 10. Sự kiện nào dưới đây gắn với tên tuổi của Nen-xơn Man-đê-la?
A.Chiến sĩ nổi tiếng chống ách thống trị cua bọn thực dán.
B.Lãnh tụ của phong trào giải phóng dân tộc ở An-giê-ri. .
C. Lãnh tụ của phong tràơ giải phóng dân tộc ờ Ảng-gỏ-la.
D. Lãnh tụ của phong trào đâu tranh chống chế độ phân biệt chủng tộc ở Châu Phi.
Câu 11. Sự kiện lịch sử nào mở đầu cho cách mạng Cu-ba?
A.Cuộc đô bộ cua tàu 'Gran-ma' len đất Cu-ba (1956).
B.Cuộc tấn công vào trại lính Môn-ca-đa (26-7-1953).  
C.Nghĩa quân Cu-ba mờ cuộc tấn công (1958).
D.Nghĩa quân Cu-ba chiếm lĩnh thủ đô La-ha-ba-na (1-1-1959). 
Câu 12. Vì sao nảm 1960 đã đi vào lịch sử với tên gọi là 'Năm châu phi'?
A.Có nhiều nước ở châu Phi được trao trả độclập.
B.Châu Phi là châu có phong trào giải phóng dântộc phát triển sớm  nhất,mạnh nhất.
C. Có 17 nước ở châu Phi tuyên bố độc lập.            
D.Châu Phi là 'Lục địa mới trỗi dậy”. 
Câu 13. Kẻ thù chủ yếu trong cuộc cách mạng giải phóng dân tộc của người dân da đen ở Nam Phi là ai?
A. Chủ nghĩa thực dân cũ. B. Chủ nghĩa thực dân mới.
C. Chủ nghĩa A-pác-thai. D.Chủ nghĩa thực dân cũ và mới.
Câu 14: Sau khi giành được độc lập từ tay thực dân Tây Ban Nha và Bồ Đào Nha, các nước Mĩ Latinh lại bị lệ thuộc vào 
A. Anh.  
B. Pháp.                            
C. Đức.  
D. Mĩ. 
Câu 15: Một trong những ý nghĩa của bản Hiến pháp tháng 11-1993 ở Nam Phi là
A. đưa N.Manđêla lên làm tổng thống.                       B. xóa bỏ chủ nghĩa phân biệt chủng tộc Apácthai.
C. đưa Nam Phi trở thành một nước cộng hòa.           D. lật đổ chủ nghĩa thực dân cũ ở Nam Phi.
Câu 16: Âm mưu của Mĩ đối với các nước Mĩ Latinh sau Chiến tranh thế giới thứ hai là
A. biến thành đồng minh của mình.                      B. xây dựng vùng hợp tác phát triển kinh tế vững mạnh.
C. biến thành “sân sau” của mình.                 D. đầu tư kinh tế cho các nước Mĩ Latinh phát triển.
Câu 17: Vai trò của Tổng thống Nenxơn Manđêla đối với đất nước Nam Phi là
A. đưa Nam Phi trở thành quốc gia phát triển.               B. cầu nối trong quốc tế hòa giải dân tộc ở Nam Phi.
C. người lãnh đạo chống chủ nghĩa phân biệt chủng tộc.  D.Nam Phi trở thành thành viên của Liên hợp quốc.
Câu 18: 'Chủ nghĩa Apácthai' có nghĩa là
A. một biểu hiện của chủ nghĩa thực dân mới.               B. một chế độ độc tài chuyên chế.
C. một biểu hiện của chế độ chiếm nô.                      D. một chế độ phân biệt chủng tộc hết sức tàn bạo.
Câu 19:  Mĩ Latinh là “sân sau” của Mĩ vì 
A. bị Mĩ khống chế, lệ thuộc về KT, chính trị và ngoại giao vào Mĩ. 
B.là các nước nằm cùng một khối quân sự với Mĩ.
C. nơi có trình độ phát triển thấp, phải nhận viện trợ từ Mĩ.         
D. là khu vực chiếm đóng trực tiếp của quân đội Mĩ.
Câu 20. Châu Phi là 'Lục địa mới trỗi dậy' vì:
A. Là lá cờ đầu trong cuộc đấu tranh chống đế quốc Pháp và Mỹ.
B. Sau Chiến tranh thế giới thứ hai, phong trào giải phóng dân tộc phát triển mạnh và hầu hết các nước ở châu Phi đã giành được độc lập.
C. Sau Chiến tranh thế giới thứ hai, cơn bão táp cách mạng giải phóng dân tộc bùng nổ ở châu Phi trong cuộc đấu tranh chống chủ nghĩa đế quốc, chủ nghĩa thực dân,
D. Phong trào giải phóng dân tộc ở châu Phi đã làm rung chuyển hệ thống thuộc địa của chủ nghĩa TD ở châu lục này.
BÀI  6 -NƯỚC Mĩ
Câu 1. Nước khởi đầu cuộc cách mạng khoa học - kĩ thuật sau Chiến tranh thế giới thứ hai: 
A. Anh.
B. Pháp.
 C. Mỹ
D. Nhật 
Câu 2: Nguyên nhân cơ bản quyết định sự phát triển nhảy vọt của nền kinh tế Mĩ sau CTTG thứ hai
A.Áp dụng những thành tựu cách mạng khoa học - kĩ thuật,vào sản xuất, cải tiến kĩ thuật nâng cao năng suất lao động 
B.Tập trung sản xuất và tập trung tư bản cao
C. Quân sự hoá nền kinh tế để buôn bán vũ khí, phương tiện chiến tranh           
D. Điều kiện tự nhiên và xã hội thuận lợi 
Câu 3: Lí do Mĩ đạt được nhiều thành tựu rực rỡ ̃về khoa học-kĩ thuật
A. Mĩ là nước khởi đầu cách mạng khoa học- kĩ thuật lần thứ hai
B. Chính sách Mĩ đặc biệt quan tâm phát triển khoa học- kĩ thuật, coi đây là trung tâm  chiến lược để phát triển đất nước 
C. Nhiều nhà khoa học lỗi lạc trên thế giới đã sang Mĩ, nhiều phát minh  được nghiên cứu và ứng dụng tại Mĩ.
D. Mĩ chủ yếu là mua bằng phát minh
Câu 4. Trong khoảng 20 năm sau CTTG thứ hai, đã xuất hiện trung tâm kinh tế, tài chính nào?
A.Trung tâm kinh tế, tài chính Mĩ, Tây Âu.         
B.Trung tâm kinh tế, tài chính Mĩ, Nhật Bản
C. Trung tâm kinh tế, tài chính Mĩ. Tây Âu, Nhật Bản.
D. Mĩ là trung tâm kinh tế, tài chính duy nhất của thế giới.
Câu 5. Nguyên nhân nào dưới đây là cơ bản nhất đưa nền kinh tế của Mĩ phát triển mạnh mẽ sau Chiến tranh thế giới thứ hai?
A.Dựa vào những thành tựu khoa học-kĩ thuật của thế giới.  
B.Nhờ tài nguyên thiên nhiên phong phú
C. Nhờ trình độ tập trung sản xuất và tập trung tư bản cao.
D. Nhờ quân sự hóa nền kinh tế, thu được nhiều lợi nhuận trong chiên tranh.
Câu 6. Đặc điểm nổi bật nhất của nền kinh tê Mĩ sau Chiến tran h thê giới là gì?
A.Vị trí kinh tế của Mĩ ngày càng giảm sút trên toàn thế giới.
B.Mĩ bị các nước Tây Au và Nhật Bản cạnh tranh quyết liệt.
C. Kinh tế phát triển nhanh, nhưng không ốn định vì thường xuyên xảy ra nhiều cuộc suy thoái.
D.Sự chênh lệch giàu nghòo ngày càng lớn.
Câu 7. Thất bại nặng nề nhất của đế quốc Mĩ trong quá trình thực hiện “chiến lược toàn cầu” bởi:
A. Thắng lợi của cách mạng Trung Quốc năm 1949.      B.Thắng lợi của cách mạng Cu-ba năm 1959.
C. Thắng lợi của cách mạng I-ran năm 1979.         D.Thắng lợi của cách mạng Việt Nam năm 1975.
Câu 8. Mĩ trở thành trung tâm kinh tê - tài chính duy nhất trong thời gian nào?
A. Từ 1945 đến 1975.          B.Từ 1918 đến 1945.  C. Từ 1950 đến 1980.    D. Từ 1945 đến 1950.
Câu 9. Nước nào đưa con người lên Mặt Trăng vào năm (7-1969)?
A. Mĩ
B. Nhật
C. Liên Xô
D. Trung Quốc. 
 Câu 10. Nét nổi bật trong sự phát triển của nền kinh tế Mĩ sau Chiến tranh thế giới thứ hai là
A. phát triển ngang bằng với các nước châu Âu.
B. thiệt hại nặng nề do sự tàn phá của chiến tranh. 
C. phát triển mạnh mẽ, trở thành nền kinh tế lớn nhất thế giới.  
D. suy giảm nghiêm trọng vì đầu tư quá lớn cho quốc phòng.
Câu 11. Những thành tựu chủ yếu về khoa học - kĩ thuật của Mĩ là gì?
A.Chế ra công cụ mới, nguồn năng lượng mới, vật liệu mới,thực hiện 'Cuộc cách mạng xanh' ,trong giao thông vận tải,thông tin liên lạc, chinh phục vũ trụ, ...
B. Sản xuất được những vũ khí hiện đại.
C. Chế tạo ra bom nguyên tử.
D.Chế tạo ra vũ khí hủy diệt
Câu 12. Điểm giống nhau trong chính sách đối ngoại của các đời tống thống Mĩ là gì?
A.Chuẩn bị tiến hành ’’Chiến tranh tổng lực”.               B.'Chiến lược toàn cầu hóa”.
C. Xác lập một trật tự thế giới có lợi cho Mĩ.                 D. 'Chủ nghĩa lấp chỗ trông'.
Câu 13. Nội dung 'Chiến lược toàn cầu” của Mĩ nhằm mục tiêu cơ bản nào?
A.Ngăn chặn và tiến tới xóa bỏ CNXH trên thế giới . Đàn áp phong trào giải phóng dân tộc,phong trào công nhân. Khống chế,chi phối các nước đồng minh của Mĩ.
B.Đàn áp phong trào giải phóng dân tộc, khống chê các nước đồng minh của Mĩ. 
C.Thiết lập sự thống trị trên toàn thê giới.                       D. Tiến tới xóa bỏ CNXH trên thế giới
Câu 14. Đời tổng thống nào của Mĩ gắn liền với 'Chiến lược toàn cầu' phản cách mạng?
A. Tơ-ru-man 
B. Ken-nơ-đi 
C. Ai-xen-hao 
D. Giôn-xơn
Câu 15. Trong các liên minh quân sự dưới đây, liên minh nào không phải do Mĩ lập nên?
A. Khối NATO
B. Khối VACSAVA
C. Khối SEATO
D. Liên Hợp Quốc
Câu 16. Khôi quân sự NATO do Mĩ cầm đầu còn gọi là khối gì?
A.Khối Nam Đại Tây Dương. B. Khôi Bắc Đại Tây Dương,
C. Khối Đông Đại Tây Dương. D. Khối Tây Nam Đại Tây Dương.
Câu 17. Thành công của Mĩ trong chính sách đối ngoại là gì?
A.Thực hiện nhiều chiến lươc qua các đời Tống thống.
B.Lập được nhiều khối quân sự (NATO, SEATO, CENTO, ...).
C.Thực hiên được một số mưu đồ góp phần thúc đẩy sự sụp đổ của CNXH ở Liên Xô.
D. Thành công trong chiến lược toàn cầu.
Câu 18. Tổng thống Mĩ sang thăm Việt Nam đầu tiên vào năm nào?
A. 2000 
B. 2001 
C. 2002 
D. 2008
Câu 19. Vụ khủng bố 11/9/2001 đã tác động thế nào đến chính sách của nước Mĩ ?
A.Tăng cường hợp tác với các nước.
B.Tăng cường an ninh nội địa nước Mĩ
C.Nước Mĩ rất dễ bị tổn thương và chủ nghĩa khủng bố là yếu tố dẫn đến sự thay đổi trong đối nội ,đối ngoại ở thế kỉ XXI.
D.Điều chỉnh quan hệ với các nước.  
  Câu 20. Mĩ muốn thiết lập một trật tự thế giới như thế nào sau khi Chiến tranh lạnh kết thúc?
A. Trật tự thế giới hai cực.
B. Trật tự thế giới đơn cực.
C. Trật tự thế giới đa cực.D.Trật tự thế giới vô cực. 
  Câu 21. Giai đoạn nào nền kinh tế Mĩ phát triển mạnh nhất?
A. 1945-1973.
B. 1950-1973.
C. 1973-1991.
D. 1991-2000. 
  Câu 22. Yếu tố cơ bản dẫn đến sự thay đổi quan trọng trong chính sách đối nội và đối ngoại của Mĩ khi bước vào thế kỉ XXI là
A. xu thế toàn cầu hóa.                                              B. chủ nghĩa khủng bố.
C. hệ thống xã hội chủ nghĩa đã sụp đổ.                  D. các nước Á, Phi, Mĩ Latinh đã giành độc lập.
  Câu 23. Nội dung nào sau đây không là mục tiêu trong chiến lược “Cam kết và mở rộng” của Mĩ?
A. Sử dụng khẩu hiệu “Thúc đẩy dân chủ”.            B. Khống chế, chi phối các nước tư bản đồng minh. 
C. Bảo đảm an ninh của Mĩ với lực lượng quân sự mạnh. 
D. Phát triển tính năng động và sức mạnh của nền kinh tế Mĩ. 
  Câu 24. Mĩ bình thường hóa quan hệ ngoại giao với Việt Nam vào năm nào, dưới thời Tổng thống nào? 
A. 1973, Ních-xơn.
B. 1975, Pho.
C. 1989, Busơ (cha).
D. 1995, B Clin-tơn. 
 Câu 25. Chọn một câu trả lời đúng nhất trong số các câu từ A đến D để điền vào chỗ trống hoàn thiện đoạn tư liệu nói về sự phát triển kinh tế Mĩ sau Chiến tranh thế giới thứ hai: 
Năm 1949, sản lượng (1) Mĩ bằng hai lần sản lượng của các nước Anh, Pháp, Cộng hòa Liên bang Đức, Italia và Nhật Bản cộng lại. Mĩ nắm hơn 50% số (2) đi lại trên mặt biển, 3/4  (3) của thế giới. 
A. Công nghiệp – tàu chiến – dự trữ đôla.                B. Nông nghiệp – tàu chiến – dự trữ vàng. 
C. Công nghiệp – tàu chiến – dự trữ vàng.                   D. Nông nghiệp – tàu chiến – dự trữ đôla.  
 Câu 26. Nguyên nhân chủ yếu dẫn đến sự suy yếu của nền kinh tế Mĩ? 
A. Do theo đuổi tham vọng bá chủ thế giới.                B. Sự vươn lên cạnh tranh của Tây Âu và Nhật Bản. 
C. Kinh tế Mĩ không ổn định do nhiều cuộc suy thoái, khủng hoảng.  
D. Do các phong trào đấu tranh của giai cấp công nhân Mĩ.  
Câu 27. Mục tiêu chủ yếu trong “Chiến lược toàn cầu” của Mĩ là gì?
A. Tham vọng làm bá chủ thế giới.                        B. Đàn áp phong trào cách mạng thế giới. 
C. Ngăn chặn, tiến tới tiêu diệt các nước xã hội chủ nghĩa. 
D. Khống chế các nước tư bản đồng minh phụ thuộc vào Mĩ. 
Câu 28. Mĩ thực hiện chiến lược nào trong chính sách đối ngoại sau Chiến tranh thế giới thứ hai?
A. Chiến lược toàn cầu.           B. Chiến lược toàn cầu hóa. 
C. Chiến lược “Cam kết và mở rộng”.                     D. Chiến lược “Chiến tranh đặc biệt”. 
Câu 29. Nền kinh tế Mĩ bị suy thoái nghiêm trọng trong thập kỉ 70 của thế kỉ XX, là vì
A. Mĩ đã tham gia nhiều cuộc chiến tranh trên thế giới.  
B. tác động của cuộc khủng hoảng năng lượng thế giới.
C. các nước đồng minh không có khả năng trả nợ cho Mĩ. 
D. các nước Mĩ Latinh giành độc lập, Mĩ mất thị trường tiêu thụ.
Câu 30. Việt Nam có thể rút ra kinh nghiệm gì từ sự phát triển kinh tế của Mĩ sau Chiến tranh thế giới thứ hai để đẩy mạnh sự nghiệp công nghiệp hóa, hiện đại hóa đất nước? 
A. nâng cao trình độ tập trung vốn và lao động.            B. tăng cường đẩy mạnh hợp tác với các nước khác. 
C. ứng dụng các thành tựu khoa học – kĩ thuật.             D. khai thác và sử dụng hợp lí nguồn tài nguyên. 
                                BÀI 7.TÂY ÂU
Câu 1. Sau Chiến tranh thế giới thứ hai, kinh tế Anh xếp sau các mước nào trong khôi tư bản chủ nghĩa?
A. Mĩ, Nhật, Tây Đức, Pháp.                            B. Mĩ, Nhật, Hà Lan, Pháp,
C. Mĩ, Nhật, Pháp, Liên Xô. D. Mĩ, Nhật, Tây Đức, Trung Quốc.
Câu 2. Sau Chiến tranh thế giới thứ hai, hai đảng nào thay nhau cầm quyền ở Anh?
A.Đảng Cộng hòa và đảng Dân chủ.        B. Đảng Tự do và Đảng Bảo thủ. 
C. Đảng Bảo thủ và Công đảng.              D. Đảng Quốc đại và Đảng Bảo thủ.
Câu 3. Nhờ đâu sau Chiến tranh thế giới thứ hai nền công nghiệp của Tây Đức được phục hổi và phát triển nhanh chóng?
A.Nhờ ứng dụng thành tựu khoa học-kĩ thuật.    
B.Nhờ Mĩ cho vay và đầu tư vào Tây Đức hơn 50 ti mác. 
C.Nhờ tập trung sản xuất và tập trung tư bản cao độ       
D. Nhờ quân sự hóa nền kinh tê sau chiến tranh.
Câu 4. Nhật Bản và Tây Âu trở thành trưng tâm kỉnh tế, tài chính vào thời kì nào?
A.1945 đến 1950    
B.1950 đển 1973               
C. 1973 đến 1991   
D.1991 đến nay
Câu 5. Sau Chiến tranh thê giới thứ hai, chủ nghĩa tư bản còn gọi là gì?
A.Chủ nghĩa tư bản tự do cạnh tranh.                  B. Chủ nghĩa tư bản lũng đoạn nhà nước,
C. Chủ nghĩa tư bản hiện đại. D. Chủ nghĩa tư bản dộc quyền.
Câu 6 . Kế hoạch Mácsan” (1948) còn được gọi là:
A.Kế hoạch khôi phục châu Âu.                B.Kế hoạch phục hưng kinh tế các nước Tây Âu. 
C. Kế hoạch phục hưng châu Âu          
D. Kế hoạch phục hưng  kinh tế Châu Âu.
Câu 7. Khối thị trường chung Châu Âu EEC) ra đời vào năm nào?
A.1954
B.1955
C.1956
D.1957
Câu 8. Tên gọi khác của Cộng đồng Châu Âu (EC) là gì?
A.Cộng đồng kinh tế - xã hội châu Âu. B. Liên minh các nước châu Âu.
C. Liên kết kinh tế châu Âu.                       D. Liên minh Châu Âu
Câu 9.  Với sự ra đời của khối Bắc Đại Tây Dương (NATO) 4/1949, tình hình ở Châu Âu như thế nào?
A. Ổn định và có điều kiện phát triển.                      B. Có sự đối đầu gay gắt giữa các nước với nhau.
C. Căng thẳng dẫn đến sự chạy đua vũ trang và thiết lặp nhiều căn cứ quân sự.
D. Dễ xảy ra một cuộc chiến tranh mới.
Câu 10.  Các nước nào sáng lập ra Liên minh Châu Âu EU?
A. Anh – Pháp - Bỉ - Italia - Hà Lan.                B. Anh – Pháp – CHLB Đức - Hà Lan - Italia -Tây Ban Nha.
C. Pháp – CHLB Đức – Bỉ – Italia - Hà Lan - Lúc-xem-bua.
D. Pháp – CHLB Đức - Bỉ - Hà Lan – Italia - Bồ Đào Nha.
Câu 11  .  Tính đến năm 2007,  Liên minh Châu Âu (EU) gồm bao nhiêu nước?
A. 25.
B. 26.
C. 27.
D. 28.
Câu 12. Đồng tiền chung Châu Âu ra đời mang tên gì?
A. EURO.
B. MAC.
C. FRĂNG.
D. DOLLAR.
Câu 13.  Năm 1975 Định ước Henxinki được kí kết giữa 33 nước Châu Âu và những nước nào?
A. MĨ-ÚC.
B. CANADA-HÀ LAN.
C. MĨ-PHÁP.
D. MĨ-CANADA.
Câu 14. Liên minh Châu Âu viết tắc là:
A. EU.
B. AU.
C. EC.
D. EEC.
Câu 15   . Sự thành lập Liên minh châu Âu (EU) mang lại những lợi ích gì cho các nước  thành viên tham gia?
A. Mở rộng thị trường             
B. Hợp tác phát triển (nguồn vốn, nhân lực, tiềm lực KHKT…)
C. Giúp đỡ nhau khi gặp khó khăn              
D. Tăng sức cạnh tranh, tránh bị phụ thuộc, chi phối từ bên ngoài
Câu 16  . Từ khi thành lập đến nay Liên minh Châu Âu (EU) đã mấy lần đổi tên?
A. 1.
B. 2.
C. 3.
D. 4.
Câu 17.   Tháng 10 năm 1990, EU chính thức đặt quan hệ ngoại giao với nước nào?
A. Thái Lan.
B. Lào.
C. Campuchia.
D. Việt Nam.
Câu 18.  Tổ chức kinh tế,chính trị liên kết khu vực lớn nhất hành tinh được thành lập từ sau chiến tranh thế giới thứ 2 đến nay là?
A. ASEAN
B. APEC
C. EU
D. CENTO 
Câu 19 . Các mặt hàng chủ lực của Việt Nam xuất khẩu sang EU là 
A. Gạo, thủy sản, may mặc…                    B. Than, gạo, giày da….
C. Thép, giày da, may mặc.                           D. Thủy sản, giày da, may mặc.
Câu 20  . Trụ sở chính của Liên minh châu Âu (EU) đặt ở đâu?
A. Luân Đôn.             B. Pari.                         C. Beclin.          D. Brussels.
BÀI 8- NHẬT BẢN
Câu 1. Nhật Bản tuyên bố chấp nhận đầu hàng đồng minh không điều kiện vào thời gian nào?
A.14-8-1945
B.15-8-1945
 C.16-8-1945
D. 17-8-1945
Câu 2. Sau Chiến tranh thế giới thứ hai, Nhật Bản đã gặp khó khăn gì lớn nhất?
A.Bị quân đội Mĩ chiếm đóng theo chê độ quân quản.           
B. các nước đế quốc bao vây kinh tế.
C. Nạn thất nghiệp,thiếu lương thực,thực phẩm.  
D. Bị mất hết thuộc địa, kinh tế bị tàn phá nặng nề. 
 Câu 3. Nước nào trong những năm 60 của thế kỉ XX có tốc độ phát triển kinh tế 'thần kì?
A. Nước Mĩ. 
B. Nước Pháp. 
C. Nước Anh. 
D. Nước Nhật.
Câu 4. Sau Chiến tranh thế giới thứ hai, Nhật Bản tiến hành nhiều cải cách ,cải cách nào là quan trọng nhất?
A. Cải cách hiến pháp.
B.Cải cách ruộng đất
C. Cải cách giáo dục
D.Cải cách văn hóa
Câu 5. Thời gian phát triển “ thần kì ” của kinh tế Nhật Bản là
A. Từ sau chiến tranh đến năm 1950.                           B. Từ năm 1950 đến năm1960.
C. Từ năm 1960 đến năm 1973.                                      D. Từ năm 1973 đến 1991.
Câu 6. Sự phát triển 'thần kì của Nhật Bản' được biểu hiện rõ nhất ở điểm nào?
A.Năm 1968, tổng sản phẩm quốc dân đứng hàng thứ hai trên thế giới sau Mĩ 
B.Trong khoảng hơn 20 năm (1950 - 1973), tổng sản phẩm quổc dân của Nhật Bản tăng 20 lần.
C. Từ thập niên 70 (thế kỉ XX), Nhật Bản trở thành một trong ba trung tâm kinh tế tài chính của thế giới tư bản (Mĩ, Nhật Bản,Tây Âu).
D. Từ nước chiến bại, hết sức khó khăn thiếu thốn, Nhật Bản vươn lên thành siêu cường kinh tế.
Câu 7. Trong sự phát triển 'thần kì' của Nhật Bản có nguyên nhân nào giống với nguyên nhân phát triển kinh tế của các nước tư bản khác Mĩ, Tây Âu?
A.Lợi dụng vốn nước ngoài, tập trung đầu tư vào các ngành kĩ thuật then chốt.
B.Biết tận dụng và khai thác những thành tựu khoa học-kĩ thuật.
C. 'Len lách' xâm nhập vào thị trường các nước, thực hiện cải cách đân chủ.
D Phát huy truyền thống tự lực tự cường của nhân dân Nhật Bản.
Câu 8. Để phát triển khoa học kĩ thuật, ở Nhật Bản có hiện tượng gì ít thấy ở các nước khác?
A.Coi trọng và phát triển nền giáo dục quốc dân, khoa học kĩ thuật.
B. Đi sâu vào các ngành công nghiệp dân dụng.
C. Xây dựng nhiều công trình hiện đại trên mặt biển và dưới đáy biển.
D.Coi trọng việc nhập kĩ thuật hiện đại, mua bằng phát minh của nước ngoài.
Câu 9. Đặc điểm nào sau đây là đặc điểm nổi bật trong quan hệ đối ngoại của Nhật Bản sau Chiến tranh thế giới thứ hai?
A.Không đưa quân đi tham chiến ở nước ngoài.
B. Liên minh chặt chẽ với Mĩ ,Kí hiệp ước an ninh Mĩ-Nhật (1951).
C. Cạnh tranh gay gắt với Mĩ và các nước Tây Âu..
D.Phát triển kinh tế đối ngoại, xâm nhập và mở rộng phạm vi thế lực bằng kinh tế ở khắp mọi nơi, đặc biệt là Đông Nam Á.
Câu 10. Nhật Bản bắt đầu đặt quan hệ ngoai giao với các nước ASEAN
vào năm nào?
A. 1976. 
B. 1977. 
C. 1978. 
D. 1979
Câu 11. Nguyên nhân chung của sự phát triển kinh tế Mĩ, Nhật Bản sau Chiến tranh thế giới thứ hai là gì?
A.Áp dụng thành tựu khoa học-kĩ thuật vào trong sản xuất.
B.Biết thâm nhập vào thị trường các nước. 
C. Nhờ quân sự hóa nền kinh tế.  
D. Tất cả các nguyên nhân trên.
 Câu 12. Nhật Bản và Tây Âu trở thành trưng tâm kỉnh tế, tài chính vào thời kì nào?
A.1945 đến 1950  
B.1950 đển 1973    
C. 1973 đến 1991 
D.1991 đến nay
Câu 13. Nguyên nhân nào dưới đây là cơ bản nhất đưa nền kinh tẻ của Mĩ phát triển mạnh mẽ sau Chiến tranh thế giới thứ hai?
A. .Dựa vào những thành tựu khoa học-kĩ thuật của thê giới.  B.Nhờ tài nguyên thiên nhiên phong phú
C. Nhờ trình độ tập trung sản xuất và tập trung tư bản cao.
D. Nhờ quân sự hóa nền kinh tế, thu được nhiều lợi nhuận trong chiến tranh.
Câu 14. Đặc điểm nổi bật nhất của nền kinh tế Mĩ sau Chiến tranh thế giới là gì?
A.Vị trí kinh tế của Mĩ ngày càng giảm sút trên toàn thế giới.
B.Mĩ bị các nước Tây Âu và Nhật Bản cạnh tranh quyết liệt.
C. Kinh tế phát triển nhanh, nhưng không ốn định vì thường xuyên xảy ra nhiều cuộc suy thoái.
D.Sự chênh lệch giàu nghòo ngày càng lớn.
Câu 15. Đặc điểm nào sau đây là đặc điểm nổi bật trong quan hệ đối ngoại của Nhật Bản sau Chiến tranh thế giới thứ hai?
A.Không đưa quân đi tham chiến ở nước ngoài.
B. Cạnh tranh gay gắt với Mĩ và các nước Tây Âu.. 
C.Phát triển kinh tế đối ngoại, mở rộng phạm vi thế lực bằng kinh tế ở khắp mọi nơi, Đông Nam A 
D. Liên minh chặt chẽ với Mĩ ,Kí hiệp ước an ninh Mĩ-Nhật (1951).
 
Câu 16. Nhật Bản thiết lập quan hệ ngoại giao với Việt Nam vào
A. Năm 1963    
B. Năm 1973                             
C. Năm 1983         
D. Năm 1984  
  Câu 17. Chọn một câu trả lời đúng nhất trong số các câu từ A đến D để điền vào chỗ trống hoàn thiện đoạn tư liệu nói về thình hình kinh tế - tài chính của Nhật Bản từ năm 1973 đến năm 1991.
“ Từ nửa sau những năm 80, Nhật Bản đã vươn lên thành siêu ( a)  cường số 1 thế giới với lượng ( b ) và ngoại tệ gấp 3 lần của Mĩ, gấp 1,5 lần của Cộng hòa Liên bang Đức. Nhật Bản cũng là ( c ) lớn nhất thế giới ” ( Trích SGK Lịch Sử 12 )
A. a-tài chính, b-dự trữ vàng, c-chủ nợ.                     
B. a-kinh tế, b-tiền, c-chủ nợ.
C. a-tài chính, b-tiền, c-chủ nợ.                               
D. a-k. a-trình độ cao, b-52 vệ tinh, c-Mĩ, Trung Quốc.
 Câu 18. Chọn một câu trả lời đúng nhất trong số các câu từ A đến D để điền vào chỗ trống hoàn thiện đoạn tư liệu nói về  giáo dục và khoa học – kĩ thuật của Nhật Bản trong giai đoạn từ năm 1952 đến năm 1973.
“ Nhật Bản rất coi trọng giáo dục và khoa học – kĩ thuật, luôn tìm cách đẩy nhanh sự phát triển bằng cách mua bằng ( a ). Tính đến năm ( b ) Nhật Bản đã mua bằng phát minh của nước ngoài trị giá 6 tỉ USD. Khoa học – kĩ thuật và công nghệ Nhật Bản chủ yếu tập trung vào lĩnh vực sản xuất ( c ), đạt được nhiều thành tựu lớn” ( Trích SGK Lịch sử 12 )
A. a-phát minh sáng chế, b-1968, c-ứng dụng dân dụng.       
B. a-phát minh hiện đại, b-1968, c-ti vi, tủ lạnh.
C. a-phát minh hiện đại, b-1968, c-ô tô, xe máy.                          
D. a-phát minh sáng chế, b-1968, c-công nghệ cao. kinh tế, b-dự trữ vàng, c-chủ nợ.
Câu 19. Một cao trào giải phóng dân tộc đã dấy lên mạnh mẽ ở các khu vực nào sau chiến tranh thế giới thứ hai?
A. Các nước Châu Á, Châu Phi và khu vực Mỹ- Latinh
B. Các nước Châu Âu, Châu Phi và khu vực Mỹ- Latinh.
C. Các nước Châu Á, Châu Phi và khu vực Bắc Mỹ.
D. Các nước Châu Á, Châu Phi và khu vực Đông- Nam Âu
Câu 20: Nguyên nhân quyết định sự phát triển của nền kinh tế Nhật Bản sau chiến tranh thứ hai 
A. Biết xâm nhập thị trường thế giới   B. Con người ,truyền thống ' Tự lực tự cường'
C. Tác dụng của những cải cách dân chủ   D. Áp dụng những thành tựu khoa học - kĩ thuật 

Bài 9. QUAN HỆ QUỐC TẾ
TRONG VÀ SAU CHIẾN TRANH LẠNH
Câu 1. Liên Xô và Mĩ trở thành hai thế lực đối đầu  nhau rồi đi đến“chiến tranh lạnh” vào thời điểm nào?
A.Trước Chiến tranh thế giới thứ hai.              
B.Trong Chiến tranh thê giới thứ hai. 
C. Sau Chiến tranh thê giới thứ hai.                      
D. Trong và sau Chiến tranh thê giới thứ hai..
Câu 2. Bản thông diệp mà Tổng thông Tơ-ru-man gửi Quốc hội Mĩ ngày 12 - 3 - 1947 được xem là sự khởi đầu cho:
A.Chính sách thực lực của Mĩ sau chiến tranh.              B.Mưu đồ làm bá chủ thê giới của Mĩ.
C.Chính sách chống Liên Xô dẫn đến chiến tranh lạnh.        D. Chính sách chống các nước XHCN.
Câu 3. Khối quân sự Bắc Đại Tây Dương (NATO) do Mĩ lập ra 4-1949 nhằm:
A.Chống lại phong trào giải phóng dân tộc trên thê giới.
B.Chống lại Liên Xô và các nước XHCN Đông Âu. 
C.Chống lại Liên Xô, Trung Quốc và Việt Nam.
D.Chống lại các nước XHCN và phong trào giải phóng dân tộc 
Câu 4. Sự kiện nào chứng tỏ rằng đã đến lúc chiến tranh lạnh bao trùm cả thế giới?
A.Mĩ thông qua “Kế hoạch Mác-san”.     
B.“Kê hoạch Mác-san” và sự ra đời của khối quân sự NATO.
C. Sự ra đời của khối quân sự NATO và Tố chức Hiệp ước Vác-sa-va.
D. Sự ra đời và hoạt động của Tổ chức Hiệp ước Vác-sa-va.
Câu 5. Đầu tháng 12 - 1989 đã diễn ra cuộc gặp gỡ không chính thức giữa Tổng Bí thư Đảng Cộng sản Liên Xô và Tổng thống Mĩ Bu-sơ ở đâu?
A.ở Luân Đôn (Anh). B. ở I-an-ta (Liên Xó),
C. ở Man-ta (Địa Trung Hải).          D. ở Oa-sinh-tơn (Mĩ).
Câu 6. Đầu tháng 8 - 1975, 33 nước châu Âu cùng với những nứớc nào kí kết Định ước Hen-xin-ki?
A.Cùng với Mì và Liên Xô. B.Cùng với Mĩ và Pháp,
C. Cùng với Mĩ và Anh. D.Cùng với Mĩ và Ca-na-đa.
Câu 7.Mĩ phát động cuộc chiến tranh lạnh chống Liên Xô và các nước XHCN vào thời gian nào ?
 A.Tháng 2/1945    B. Ngày 12/3/1947    C.Tháng 7/1947   D.Ngày 4/4/1949
Câu 8. Năm 1991, diễn ra sự kiện gì có liên quan đến quan hệ quốc tế ?
A.Mĩ và Liên Xô chấm dứt chiến tranh lạnh.           B.Trật tự hai cực I-an-ta bị xói mòn. 
C. Trật tự hai cực I-an-ta bị sụp đổ.
 D. Xô - Mĩ tuyên bố hợp tác trên mọi phương diện
Câu 9. Sau khi “Chiến tranh lạnh” chấm dứt, Mĩ muốn thiết lập một trật tự thế giới như 
thế nào?
A. Đa cực.          B. Một cực nhiều trung tâm.        C. Đa cực nhiều trung tâm.       D. Đơn cực. 
Câu 10. Tổng thống Mĩ đầu tiên sang thăm Việt Nam là:
  A. Kennơđi       
B.Nichxơn                        
C. B Clintơn          
D. G. Bush  
Câu 11. Ngày 28 - 6 - 1991 diễn ra sự kiện gì gắn với các nước xã hiội chủ nghĩa?
A.Liên Xô và các nước Đông Âu bị sụp đổ trong công cuộc xây dựng CNXH
B.Hội đồng Tương trợ kinh tế ( SEV)tuyên bố giải thể.
C. Tổ chức Hiệp ước Vác-sa-va tuyên bố chấm dứt hoạt động.
 D. Liên Xô tuyên bồ cắt đứt quan hệ với các nước Đông Âu
Câu 12. Hậu quả nặng nề, nghiêm trọng nhất mang lại cho thế giới trong thời gian chiến tranh lạnh là
A. Các nước ráo riết, tăng cường chạy đua vũ trang.
 B. Thế giới luôn ở trong tình trạng căng thẳng, đối đầu, nguy cơ bùng nổ chiến tranh thế giới. 
 C. Hàng ngàn căn cứ quân sự được thiết lập trên toàn cầu.
D.Các nước phải chi một khối lượng khổng lồ về tiền của và sức người để sản xuất các loại vũ khí hủy diệt
Câu 13. Trong cuộc gặp gổ không chính thức đó Tống Bí thư Đảng Cộng sản Liên Xô và Tổng thống Mĩ Bu-sơ  (12/1989) đã cùng tuyên bô vấn đề gì?
A.Vấn đề chấm dứt việc chạy đua vù trang.          B.Vấn đề hạn chê vù khí hạt nhân huy diệt, 
C. Vấn đề chấm dứt chiến tranh lạnh.
D. Vấn đề giừ gìn hòa bình, an ninh cho nhân loại. 
Câu 14: Xu thế hòa hoãn Đông -Tây và chiến tranh lạnh chấm dứt trong thời gian nào?
A. Những năm 50 của thế kỷ XX.   B. Những năm 60 của thế kỷ XX.
C. Những năm 70 của thế kỷ XX.   D. Những năm 80 của thế kỷ XX.
  Câu 15. Liên Xô và Mỹ tuyên bố chấm dứt chiến tranh lạnh vì:
A. Do chạy đua vũ trang gây tốn kém                 B. Mỹ vươn lên thành nước tư bản giàu mạnh
C. Sự thành công của cách mạng Trung Quốc       D. Sự sụp đổ của chế độ XHCN ở Liên Xô và Đông Âu
Câu 16. vì sao mĩ thực hiện kế hoạch Macsan?
A. Mĩ muốn giúp các nước châu Âu khôi phục kinh tế sau chiến tranh.
B. Tập hợp các nước Tây Âu vào liên minh chống Liên Xô.
C. Vì các nước tây Âu cùng phát triển theo con đường TBCN.
D. Để thực hiện những thỏa thuận của hội nghị Ianta.
   Câu 17. Để thực hiện mưu đồ bá chủ thế giới Mĩ lo ngại nhất điều gì?
A. Chủ nghĩa xã hội trở thành hệ thống thế giới              B. Sự vươn lên của Nhật Bản, Tây Âu
C. Sự thành công của cách mạng Trung Quốc                D. Liên Xô xây dựng thành công CNXH
Câu 18. Sau chiến tranh thế giới thứ 2 Mỹ có ưu thế gì về vũ khí?
A. Có tàu ngầm    B. Nhiều hạm đội trên biển
C. Nắm độc quyền vũ khí nguyên tử  D. Chế tạo nhiều vũ khí thông thường mới
  Câu 19. Tại sao Mỹ tự cho mình quyền lãnh đạo thế giới?
A. Kinh tế Mỹ giàu nhất thế giới   B. Mỹ là thành viên thường trực Liên Hiệp Quốc
C. Thắng trận trong chiến tranh thế giới 2. D. Mỹ nắm độc quyền vũ khí nguyên tử
   Câu 20: Những năm 1989 - 1991 diễn ra sự kiện gì gắn với  CNXH ở Liên Xô và các nước  Đông Âu?
A. Chế độ XHCN tan rã ở Đông Âu và Liên Xô        B. Liên Xô và các nước Đông Âu lâm vào tình trạng trì trệ
C. Liên Xô và các nước Đông Âu cắt đứt quan hệ với nhau 
D. Chế độ XHCN ở Liên Xô và Đông Âu bước vào thời kì phát triển, ổn định
Câu 21. Sự kiện ngày 11-9-2001 đã dặt các quốc gia - dân tộc đứng trước những thách thức gì?
A. Chủ nghĩa dân tộc     B. Chủ nghĩa khủng bố 
C. Chiến tranh năng lượng    D. Chủ nghĩa phân biệt chủng tộc
Câu 22. Trật tự thế giới 'hai cực' sụp đổ, những trật tự thế giới mới lại được hình thành như thế nào?
A. Xu hướng 'đơn cực'     B. Xu hướng 'đa cực'
C. Xu hướng chia sẻ hợp tác     D. Xu thế hòa bình hợp tác
Câu 23. Trât tự thế giới 'hai cực Ianta' sụp đổ vào năm nào?
A. Năm 1975               
B. Năm 1985                           
C. Năm 1989               
D. Năm 1991 
  Câu 24. Sự kiện nào không nằm trong tình hình thế giới sau chiến tranh lạnh?
A. Trật tự thế giới mới đang trong quá trình hình thành
B. Mĩ ra sức thiết lập trật tự thế giới mới 'một cực'
C. Ở nhiều khu vực nội chiến, xung đột vẫn diễn ra thường xuyên
D. Liên Xô và Mĩ thiết lập mỗi quan hệ ngoại giao về hợp tác kinh tế
Câu 25. Vì sao mâu thuẫn Đông - Tây lại hình thành sau khi chiến tranh thế giới thứ II kết thúc.
A. Sự đối lập về mục tiêu và chiến lược.  B. Sự lớn mạnh của Nhật Bản, Tây Âu.
C. Sự hình thành và phát triển của EU.  D. Sự hình thành trật tự hai cực Ianta.

BÀI 10:CÁCH MẠNG KHOA HỌC – CÔNG NGHỆ 
VÀ XU THẾ TOÀN CẦU HÓA NỬA SAU THẾ KỶ XX

 Câu 1: Cách mạng khoa học – công nghệ bắt đầu từ
A. những năm 40 của thế kỉ XX.
B. những năm 30 của thế kỉ XX.
C. những năm 50 của thế kỉ XX.
D. những năm 60 của thế kỉ XX.
 Câu 2: Cuộc cách mạng khoa học - kĩ thuật (những năm 40 của thế kỉ XX) phát triển qua mấy giai đoạn?
A. hai giai đoạn
B. ba giai đoạn
C. bốn giai đoạn
D. năm giai đoạn
 Câu 3: Từ những năm 70 (thế kỉ XX ), cuộc cách mạng khoa học - công nghệ chủ yếu diễn ra trên lĩnh vực
A. kinh tế
B. công nghiệp
C. khoa học
D. công nghệ
 Câu 4: Cuộc cách mạng công nghiệp diễn ra vào thế kỉ
A. XV.
B.  XVI.
C. XVII. 
D. XVIII.
 Câu 5: Cuộc cách mạng khoa học - kĩ thuật từ những năm 40 của thế kỉ XX khởi đầu ở nước
A. Nga.
B. Mĩ.
C. Anh.
D. Pháp.
 Câu 6: Xu thế toàn cầu hóa bắt đầu xuất hiện vào
A. đầu những năm 70 của thế kỉ XX.
B. cuối những năm 80 của thế kỉ XX.
C. đầu những năm 80 của thế kỉ XX.
D. đầu những năm 90 của thế kỉ XX.
Câu 7: WTO là tên viết tắt của tổ chức
A. Hiệp ước Thương mại tự do Bắc Mĩ.
B. Diễn đàn hợp tác Á - Âu.
C. Tổ chức thương mại thế giới.
D. Diễn đàn hợp tác kinh tế châu Á - Thái Bình Dương.
   Câu 8: Đặc điểm lớn nhất của cuộc cách mạng khoa học - công nghệ lần hai là
A. khoa học trở thành lực lượng sản xuất trực tiếp.
B. khoa học gắn liền với kĩ thuật.
C. mọi phát minh khoa học đều bắt nguồn từ sản xuất.
D. kĩ thuật đi trước mở đường cho sản xuất.


  Câu 9: Một hệ quả quan trọng của cách mạng khoa học - công nghệ từ đầu những năm 80 của thế kỉ XX là 
A. sự thay đổi về cơ cấu dân số.
B. chất lượng nguồn nhân lực ngày càng cao.
C. sự hình thành một thị trường thế giới với xu thế toàn cầu hoá.
D. nâng cao không ngừng chất lượng cuộc sống của con người.
  
   Câu 10: Toàn cầu hóa là ?
A. sự phụ thuộc lẫn nhau giữa các khu vực, quốc gia.
B. sự tăng lên mạnh mẽ những mối liên hệ, những ảnh hưởng tác động lẫn nhau, phụ thuộc lẫn nhau của tất cả các khu vực, các quốc gia, các dân tộc trên thế giới.
C. sự tác động lẫn nhau của tất cả các khu vực, các quốc gia trên thế giới.
D. sự tăng mạnh mẽ những mối liên hệ của tất cả các khu vực, các quốc gia, các dân tộc trên thế giới.
   Câu 11. Sự tồn tại của toàn cầu hoá là
A. sự bùng nổ tức thời của kinh tế thế giới.
B. sự tồn tại tạm thời trong quá trình phát triển nhanh chóng của thương mại quốc tế.
C. xu thế chủ quan của các cường quốc kinh tế hàng đầu thế giới.
D. xu thế khách quan, là một thực tế không thể đảo ngược.
   Câu 12: Nguồn gốc  chung của hai cuộc cách mạng: cách mạng công nghiệp thế kỉ XVIII - XIX và cách mạng khoa học công nghệ thế kỉ XX là 
A. sự bùng nổ dân số.
B. đáp ứng nhu cầu vật chất và tinh thần ngày càng cao của con người.
C. nhu cầu của sản xuất vũ khí.
D. yêu cầu của phát triển sản xuất.

Câu 13. Cuộc cách mạng khoa học – công nghệ đã tác động tích cực đến xã hội loài người:
A. Đưa con người bước sang nền văn minh công nghiệp.              B. Làm thay đổi cơ bản các yếu tố sản xuất.
C. Làm nảy sinh nhiều vấn đề xã hội gắn liền với kỹ thuật hiện đại.
D. Tăng năng suất lao động,nâng cao mức sống và chất lượng cuộc sống,thay đổi cơ cấu dân cư…hình thành xu thế toàn cầu hóa.
Câu 14. Cuộc cách mạng khoa học – công nghệ đã gây những hậu quả tiêu cực đến đời sống của con người:
A. Đưa con người trở về nền văn minh nông nghiệp.
B. Cơ cấu dân cư thay đổi, lao động công nông giảm đi, lao động dịch vụ và trí óc tăng lên.
C. Tài nguyên cạn kiệt, môi trường ô nhiễm nặng,dịch bệnh tăng lên …
D. Tất cả các câu trên đều đúng.
Câu 15: Nguồn gốc cách mạng khoa học- công nghệ 
A. Do yêu cầu cuộc sống                                      B. Do yêu cầu chiến tranh thế giới thứ hai
C. Những thành tựu khoa học- kĩ thuật  cuối thế kỷ XIX đầu thế kỹ XX, tạo tiền đề và thúc đẩy sự bùng nổ cách mạng khoa học- kĩ thuật lần hai
D. Do đòi hỏi cuộc sống nhằm đáp ứng nhu cầu vật chất và tinh thần ngày càng cao của con người, do yêu cầu chiến tranh thế giới thứ hai.
Câu 16. Máy tính điện tử đầu tiên ra đời ở nước nào?
A. Mĩ            
B. Nhật.       
C. Liên Xô. 
D. Anh.
Câu 17 . Đâu là hạn chế lớn nhất trong quá trình diễn ra cuộc cách mạng khoa học- kĩ thuật lần thứ 2 ?
A.Cách mạng khoa học - kĩ thuật chế tạo vũ khí đặt nhân loại trước nguy cơ một cuộc chiến  mới.
B.Nguy cơ của một cuộc chiến tranh hạt nhân.
C. Chê tạo các loại vũ khí  có tính chất tàn phá,hủy diệt. nạn ô nhiễm môi trường, tai nạn, bệnh tật.
 D. Nạn khủng bố, gây nên tình hình căng thẳng
 Câu 18. Ý nghĩa then chốt, quan trọng nhât của cách mạng khoa học – công nghệ?
A.Tạo ra một khối lượng hàng hoá đồ sộ.         
B.Đưa loài người chuyển sang nền văn minh trí tuệ.
C. Thay đối một cách cơ bản các nhân tồ sản xuất.
D. Sự giao lưu quốc tê ngày càng được mơ rộng.
Câu 19: Việt Nam chính thức gia nhập tổ chức Thương mại thế giới WTO vào ngày
A. 7/11/2006 tại Giơ- ne-vơ (Thụy sĩ).                   B. 11/11/2006 tại Hà Nội.
C. 11/11/2006 tại Pari (Pháp).                               D.  7/11/2006 tại Niu-oóc (Mỹ).
 
Câu 20: APEC là tên viết tắt của tổ chức
A. Quỹ tiền tệ quốc tế.                                     B. Hiệp ước thương mại tự do Bắc Mĩ.
C. Diễn đàn hợp tác kinh tế châu Á- Thái Bình Dương              D. Diễn đàn hợp tác Á- Âu.

 
Câu 21: Sau “ Chiến tranh lạnh”, hầu như tất cả các quốc gia đều lấy chiến lược  phát triển nào làm trọng điểm
A. Văn hóa.            
B. Chính trị.  
C. Quân sự.  
D. Kinh tế.
 Câu 22: Hệ quả quan trọng của cuộc cách mạng nào đã dẫn đến xu thế “toàn cầu hóa”?
A. Cách mạng khoa học – công nghệ.                       B. Cách mạng công nghiệp thế kỷ XVIII-XIX
C. Cách mạng giải phóng dân tộc.                          D. Cách mạng xã hội chủ nghĩa.
   Câu 23. Chiến lược toàn cầu của Mỹ dựa trên sức mạnh vượt trội nào?
A. Sức mạnh kinh tế.  B. Sức mạnh khoa học- kỹ thuật.
C. Sức mạnh văn hóa.  D. Sức mạnh kinh tế, tài chính và quân sự.
Câu 24. Hai cường quốc đã chi phối trật tự thế giới sau chiến tranh thế giới thứ hai là
A. Mỹ và Anh.          B. Mỹ và Đức.          C. Mỹ và Liên-xô.       D. Mỹ và Trung Quốc.
 
Câu 25: Xu thế toàn cầu hóa bắt đầu xuất hiện vào
A. đầu những năm 70 của thế kỉ XX.
B. cuối những năm 80 của thế kỉ XX.
C. đầu những năm 80 của thế kỉ XX.
D. đầu những năm 90 của thế kỉ XX.
`;

function start() {
    qss = [];
    document.getElementById("res").innerHTML = "";
    document.getElementById("qmain").innerHTML = "";
    renderQ(lgen())
}