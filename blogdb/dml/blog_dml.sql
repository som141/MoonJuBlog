-- 회원가입
insert into user values ('som030029@gmail.com','123asd','som','01089779897','경기도 용인시 수지구','신세계',null);
-- 로그인
select * from user where email='som030029@gmail.com';
-- 게시물 작성
insert into board (title, content,write_datetime,favorite_count,comment_count,board.view_count,writer_email)
values ('제목','내용','2024-08-20 20:32',0,0,0,'som030029@gmail.com');
insert into image(board_number, image) values('2','url2');

-- 댓글 작성
insert into
    comment(content,write_datetime,user_email,board_number) values ('hi','2023-08-11 20:12','som030029@gmail.com',1);
update board set comment_count =comment_count+1 where board_number =1;
-- 좋아요
insert into favorite values ('1','som030029@gmail.com');
update board set board.favorite_count =favorite_count+1 where board_number =1;

delete from favorite where user_email='som030029@gmail.com' and board_number =1;
update board set board.favorite_count =favorite_count-1 where board_number =1;
-- 게시물 수정
update board set title='수정제목입니다.',content ='update content'where board_number =1;
delete from image where  board_number =1;
insert into image(board_number, image) values('2','url');
-- 게시물 삭제
delete from comment where board_number =1;
delete from favorite where  board_number =1;
delete from board where  board_number =2;

-- 상세 게시물 불러오기
select b.board_number as board_number,
       b.title as title,
       b.content as content,
       b.writer_email as write_email,
       b.write_datetime as write_datetime,
       u.nickname as nickname,
       u.profile_image as profile_image
from board as b
         inner join user as u
                    on b.writer_email = u.email
where board_number=2;

select image from image where board_number =2;
select
    u.email as email,
    u.nickname as nickname,
    u.profile_image
from favorite as f
inner join user as u
on u.email = f.user_email
where f.board_number =3;

select
    u.nickname as nickname,
    u.profile_image as profile_image,
    c.write_datetime as write_datetime,
    c.content as content
from comment as c
inner join user as u on c.user_email =u.email
where c.board_number =4
order by  write_datetime desc;

-- 리스트 뷰
create view board_list_view as
select
    b.board_number as board_number,
    b.title as title,
    b.content as content,
    b.writer_email as writer_email,
    i.image as image,
    b.favorite_count as favorite_count,
    b.comment_count as comment_count,
    b.view_count as view_count,
    b.write_datetime as write_datetime,
    u.nickname as writer_nickname,
    u.profile_image as writer_profile_image
from board as b
         inner join user as u
                    on b.writer_email = u.email
         left join (select board_number ,any_value(image.image) as image from image GROUP BY board_number) as i
                   on b.board_number =i.board_number;




-- 최신게시물 리스트 불러오기
select *
from board_list_view
order by write_datetime
LIMIT 5,5;

-- 검색어 리스트
select *
from board_list_view
where title LIKE '%제목%' or content LIKE '%수정%'
order by write_datetime;

-- 주간 상위 3 게시물 리스트
select *
from board_list_view
where write_datetime between '2024-08-19 00:00' and '2024-08-29 00:00'
order by favorite_count desc,comment_count desc, view_count desc
limit 3;

-- 특정 유저 게시물 리스트 불러오기
select
    b.board_number as board_number,
    b.title as title,
    b.content as content,
    i.image as image,
    b.favorite_count as favorite_count,
    b.comment_count as comment_count,
    b.view_count as view_count,
    b.write_datetime as write_datetime,
    u.nickname as writer_nickname,
    u.profile_image as writer_profile_image
from board as b
         inner join user as u
                    on b.writer_email = u.email
         left join (select board_number ,any_value(image.image) as image from image GROUP BY board_number) as i
                   on b.board_number =i.board_number
where b.writer_email = 'som030029@gmail.com'
order by write_datetime;

-- 인기 검색어 리스트
select search_word.search_word, count(search_word.search_word) as count
from search_word
where relation is false
group by search_word
order by count desc
limit 15;

-- 관련 검색어 리스트
select relation_word ,count(relation_word)as count
from search_word
where search_word = '검색어'
group by relation_word
order by count desc
limit 15;

-- 유저 정보 불러오기/로그인 유저 정보 불러오기
select *
from user
where email = 'email@email.com';

-- 닉네임 수정
update user set nickname = '수정 닉네임' where email = 'email@email.com';

-- 프로필 이미지 수정
update user set profile_image = 'url' where email ='email@email.com';



