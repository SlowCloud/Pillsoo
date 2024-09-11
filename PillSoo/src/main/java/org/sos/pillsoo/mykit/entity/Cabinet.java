package org.sos.pillsoo.mykit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.supplement.entity.Supplement;

@Entity
@Getter
@Setter
@Table(name = "Cabinet")
public class Cabinet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int mykitSeq;

    @ManyToOne
    @JoinColumn(name = "userSeq")
    private User user;

    @ManyToOne
    @JoinColumn(name = "supplementSeq")
    private Supplement supplement;
}
