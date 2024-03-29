package com.legacy.health.fhir.meta.sql;

import java.util.HashSet;
import java.util.Set;

public class RecursionGuard {

    Set<String> encounterdTypes = new HashSet<>();

    public RecursionGuard() {
        this.encounterdTypes = new HashSet<>();
    }

    public RecursionGuard(RecursionGuard guard) {
        this.encounterdTypes = new HashSet<>(guard.encounterdTypes);
    }

    public CategorizedElement check(CategorizedElement child) {
        if (encounterdTypes.contains(child.getElem().getId())) {
            return null;
        } else {
            encounterdTypes.add(child.getElem().getId());
            return child;
        }
    }
}
