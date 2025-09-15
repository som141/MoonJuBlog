package blog.moonju.moonjublogapi.repository;

import blog.moonju.moonjublogapi.domain.SearchWord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SearchWordRepository extends JpaRepository<SearchWord,Long> {
    Optional<SearchWord> findByWord(String word);
}
