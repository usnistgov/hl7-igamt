package gov.nist.hit.hl7.igamt.ig.model;

public class ResourceSkeletonBoneCardinality {
    int min;
    String max;

    public ResourceSkeletonBoneCardinality(int min, String max) {
        this.min = min;
        this.max = max;
    }

    public ResourceSkeletonBoneCardinality() {
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
    }

    public String getMax() {
        return max;
    }

    public void setMax(String max) {
        this.max = max;
    }
}
