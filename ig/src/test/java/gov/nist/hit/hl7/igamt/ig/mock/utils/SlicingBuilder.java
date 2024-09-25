package gov.nist.hit.hl7.igamt.ig.mock.utils;

import gov.nist.hit.hl7.igamt.common.slicing.domain.*;
import gov.nist.hit.hl7.igamt.constraints.domain.assertion.Assertion;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class SlicingBuilder {

	public static class OccurrenceSlicingBuilder {
		private final SlicingBuilder slicingBuilder;
		private final OrderedSlicing orderedSlicing;

		public OccurrenceSlicingBuilder(SlicingBuilder slicingBuilder) {
			this.slicingBuilder = slicingBuilder;
			this.orderedSlicing = new OrderedSlicing();
			this.orderedSlicing.setSlices(new ArrayList<>());
		}

		public OccurrenceSlicingBuilder withPath(String path) {
			orderedSlicing.setPath(path);
			return this;
		}

		public OccurrenceSlicingBuilder addSlice(int position, String flavorId) {
			OrderedSlice slice = new OrderedSlice();
			slice.setPosition(position);
			slice.setId(position+"id");
			slice.setFlavorId(flavorId);
			orderedSlicing.getSlices().add(slice);
			return this;
		}

		public SlicingBuilder add() {
			this.slicingBuilder.withSlicing(orderedSlicing);
			return this.slicingBuilder;
		}
	}

	public static class AssertionSlicingBuilder {
		private final SlicingBuilder slicingBuilder;
		private final ConditionalSlicing conditionalSlicing;

		public AssertionSlicingBuilder(SlicingBuilder slicingBuilder) {
			this.slicingBuilder = slicingBuilder;
			this.conditionalSlicing = new ConditionalSlicing();
			this.conditionalSlicing.setSlices(new ArrayList<>());

		}

		public AssertionSlicingBuilder withPath(String path) {
			conditionalSlicing.setPath(path);
			return this;
		}

		public AssertionSlicingBuilder addSlice(Assertion assertion, String flavorId) {
			ConditionalSlice slice = new ConditionalSlice();
			slice.setAssertion(assertion);
			slice.setId(conditionalSlicing.getSlices().size()+"id");
			slice.setFlavorId(flavorId);
			conditionalSlicing.getSlices().add(slice);
			return this;
		}

		public SlicingBuilder add() {
			this.slicingBuilder.withSlicing(conditionalSlicing);
			return this.slicingBuilder;
		}
	}

	private final Set<Slicing> slicings = new HashSet<>();

	public static SlicingBuilder create() {
		return new SlicingBuilder();
	}

	public AssertionSlicingBuilder addConditionalSlicing(String path) {
		AssertionSlicingBuilder assertionSlicingBuilder = new AssertionSlicingBuilder(this);
		return assertionSlicingBuilder.withPath(path);
	}

	public OccurrenceSlicingBuilder addOccurrenceSlicing(String path) {
		OccurrenceSlicingBuilder occurrenceSlicingBuilder = new OccurrenceSlicingBuilder(this);
		return occurrenceSlicingBuilder.withPath(path);
	}

	public Set<Slicing> build() {
		return this.slicings;
	}

	public SlicingBuilder withSlicing(Slicing slicing) {
		this.slicings.add(slicing);
		return this;
	}
}
