package org.example.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttestationsAutoriseesKey implements Serializable {
    private Long idcompagnie;

    private Long idtypeattestation;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AttestationsAutoriseesKey that = (AttestationsAutoriseesKey) o;
        return Objects.equals(idcompagnie, that.idcompagnie) &&
                Objects.equals(idtypeattestation, that.idtypeattestation);
    }

    // hashCode method
    @Override
    public int hashCode() {
        return Objects.hash(idcompagnie, idtypeattestation);
    }



}
