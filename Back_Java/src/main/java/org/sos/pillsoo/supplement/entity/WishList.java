package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.sos.pillsoo.auth.entity.User;

@Getter
@Setter
@Entity
@Table(name = "WishList")
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long wishSeq;

    @ManyToOne
    @JoinColumn(name = "supplementSeq")
    private Supplement supplement;

    @ManyToOne
    @JoinColumn(name = "userSeq")
    private User user;
}
