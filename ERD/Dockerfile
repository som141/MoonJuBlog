# 기본 MySQL 8 이미지 사용
FROM mysql:8.0

# 선택: 타임존
ENV TZ=Asia/Seoul

# 기본 문자셋/콜레이션/인증 플러그인 (필요시 숫자만 바꿔 다시 빌드)
CMD ["mysqld",
     "--default-authentication-plugin=mysql_native_password",
     "--character-set-server=utf8mb4",
     "--collation-server=utf8mb4_unicode_ci"]

EXPOSE 3306
