package com.mentalhealth.companion.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mentalhealth.companion.entity.AICopingTip;
@Repository
public interface AiCopingTipRepository extends JpaRepository<AICopingTip,Long>{
    
}
